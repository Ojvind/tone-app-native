import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

// All note rendering and audio lives in here so we can use VexFlow (DOM-based)
// and Web Audio API, both of which require a browser environment.
const WEBVIEW_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #fff; display: flex; justify-content: center; padding: 8px 0; }
    #container svg { max-width: 100%; height: auto; }
    #error { color: red; font-family: sans-serif; font-size: 12px; padding: 8px; }
  </style>
</head>
<body>
  <div id="container"></div>
  <div id="error"></div>
  <script src="https://unpkg.com/vexflow@5/build/cjs/vexflow.js"></script>
  <script>
    // Resolve VexFlow global — v5 may expose as Vex.Flow or VexFlow
    function getVF() {
      if (typeof Vex !== 'undefined' && Vex.Flow) return Vex.Flow;
      if (typeof VexFlow !== 'undefined') return VexFlow;
      return null;
    }

    // Parse note key like 'c/4', 'a#/3' into frequency
    function noteToFrequency(key) {
      var A4 = 440;
      var noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
      var normalized = key.replace('/', '').toUpperCase(); // 'c/4' -> 'C4'
      var octave = parseInt(normalized[normalized.length - 1], 10);
      var pitch = normalized.slice(0, normalized.length - 1);
      var keyNumber = noteNames.indexOf(pitch);
      if (keyNumber < 0) return null;
      var n = keyNumber + (octave * 12);
      var a4Index = noteNames.indexOf('A') + (4 * 12);
      return A4 * Math.pow(2, (n - a4Index) / 12);
    }

    var sharedAudioCtx = null;
    function getAudioCtx() {
      if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
        sharedAudioCtx = new AudioContext();
      }
      return sharedAudioCtx;
    }

    function playFrequency(freq) {
      try {
        var audioCtx = getAudioCtx();
        var now = audioCtx.currentTime;
        var duration = 2.5;

        // Piano harmonics: [frequency multiplier, relative volume]
        var harmonics = [
          [1,    0.7],
          [2,    0.15],
          [3,    0.08],
          [4,    0.04],
          [5,    0.02],
          [6,    0.01],
        ];

        var masterGain = audioCtx.createGain();
        masterGain.connect(audioCtx.destination);
        // Piano envelope: instant attack, fast initial drop, long decay
        masterGain.gain.setValueAtTime(0, now);
        masterGain.gain.linearRampToValueAtTime(1, now + 0.005);
        masterGain.gain.exponentialRampToValueAtTime(0.3, now + 0.1);
        masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        harmonics.forEach(function(h) {
          var osc = audioCtx.createOscillator();
          var gainNode = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq * h[0];
          gainNode.gain.value = h[1];
          osc.connect(gainNode);
          gainNode.connect(masterGain);
          osc.start(now);
          osc.stop(now + duration);
        });
      } catch (e) {
        // Audio not available, silently skip
      }
    }

    function renderNotes(notes) {
      var container = document.getElementById('container');
      container.innerHTML = '';
      document.getElementById('error').textContent = '';

      var VF = getVF();
      if (!VF) {
        document.getElementById('error').textContent = 'VexFlow not loaded yet.';
        return;
      }

      try {
        var renderer = new VF.Renderer(container, VF.Renderer.Backends.SVG);
        renderer.resize(340, 220);
        var context = renderer.getContext();
        context.setFont('Arial', 10);

        var y = 10;
        ['treble', 'bass'].forEach(function(clef) {
          var clefNotes = notes.filter(function(n) { return n.clef === clef; });
          if (clefNotes.length === 0) return;

          var stave = new VF.Stave(10, y, 300);
          stave.addClef(clef).setContext(context).draw();

          var staveNotes = clefNotes.map(function(note) {
            return new VF.StaveNote({ clef: clef, keys: [note.key], duration: 'q' });
          });

          VF.Formatter.FormatAndDraw(context, stave, staveNotes);
          y += 110;
        });
      } catch (e) {
        document.getElementById('error').textContent = 'Render error: ' + e.message;
      }
    }

    function handleMessage(data) {
      if (data.type === 'RENDER_NOTES') {
        renderNotes(data.notes);
        data.notes.forEach(function(note, index) {
          var freq = noteToFrequency(note.key);
          if (freq) {
            setTimeout(function() { playFrequency(freq); }, index * 900);
          }
        });
      }
    }

    // Android posts to document, iOS posts to window
    document.addEventListener('message', function(e) { handleMessage(JSON.parse(e.data)); });
    window.addEventListener('message', function(e) { handleMessage(JSON.parse(e.data)); });
  </script>
</body>
</html>
`;

export default function NoteDisplay({ notes }) {
  const webViewRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const pendingRef = useRef(null);

  useEffect(() => {
    if (notes.length === 0) return;
    const message = JSON.stringify({ type: 'RENDER_NOTES', notes });
    if (loaded && webViewRef.current) {
      webViewRef.current.postMessage(message);
    } else {
      pendingRef.current = message;
    }
  }, [notes, loaded]);

  const handleLoadEnd = () => {
    setLoaded(true);
    if (pendingRef.current && webViewRef.current) {
      webViewRef.current.postMessage(pendingRef.current);
      pendingRef.current = null;
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: WEBVIEW_HTML }}
        style={styles.webView}
        onLoadEnd={handleLoadEnd}
        scrollEnabled={false}
        originWhitelist={['*']}
        // Allow audio autoplay on iOS
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 230,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  webView: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
