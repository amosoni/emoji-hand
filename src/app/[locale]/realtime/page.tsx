import RealtimeTranslator from "~/components/RealtimeTranslator";

export default function RealtimePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🚀 Real-time Emoji Translation
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Experience instant emoji translation with WebSocket-powered real-time communication. 
            Watch as your text transforms into expressive emoji expressions in real-time!
          </p>
        </div>
        
        <RealtimeTranslator />
        
        <div className="mt-12 text-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">
              🔧 How to Use
            </h2>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">1. Start WebSocket Server</h3>
                <div className="bg-black/30 rounded-lg p-4 font-mono text-sm">
                  <div className="text-green-400">npm install ws dotenv</div>
                  <div className="text-blue-400">node ws-server.js</div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">2. Connect & Chat</h3>
                <ul className="text-white/80 space-y-2">
                  <li>• Click "Connect" to establish WebSocket connection</li>
                  <li>• Choose your translation mode</li>
                  <li>• Type your message and watch it transform in real-time</li>
                  <li>• See streaming responses as they're generated</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 