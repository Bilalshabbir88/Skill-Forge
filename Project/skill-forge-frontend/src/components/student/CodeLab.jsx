import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, CheckCircle2, XCircle, Info, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import api from '../../api/api';

const CodeLab = ({ lab }) => {
  const [code, setCode] = useState(lab.starterCode || '');
  const [results, setResults] = useState(null);
  const [executing, setExecuting] = useState(false);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' or 'results'

  const handleRun = async () => {
    setExecuting(true);
    setActiveTab('results');
    try {
      const res = await api.post(`/labs/${lab._id}/execute`, { code });
      setResults(res.data.data);
    } catch (error) {
      console.error('Execution failed:', error);
      setResults({ error: 'Failed to connect to code execution server.' });
    } finally {
      setExecuting(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your code to the starter template?')) {
      setCode(lab.starterCode || '');
      setResults(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
      {/* Lab Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/50">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
            <Info className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{lab.title}</h2>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{lab.language} LAB</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleReset} className="h-9">
            <RotateCcw className="w-4 h-4 mr-2" /> Reset
          </Button>
          <Button size="sm" onClick={handleRun} disabled={executing} className="h-9 bg-green-600 hover:bg-green-700">
            {executing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
            Run Tests
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Instructions */}
        <div className="w-1/3 border-r border-gray-200 dark:border-gray-800 overflow-y-auto p-6 bg-gray-50/30 dark:bg-gray-950/30">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <ChevronRight className="w-4 h-4 mr-1 text-primary-500" /> Instructions
          </h3>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">
              {lab.instructions}
            </div>
          </div>
        </div>

        {/* Right Panel: Editor + Results */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-800 px-4">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'editor' 
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Editor
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'results' 
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Output {results && <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${results.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{results.passed ? '✓' : '×'}</span>}
            </button>
          </div>

          <div className="flex-1 relative">
            {activeTab === 'editor' ? (
              <Editor
                height="100%"
                language={lab.language === 'python' ? 'python' : 'javascript'}
                theme="vs-dark"
                value={code}
                onChange={setCode}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 16, bottom: 16 }
                }}
              />
            ) : (
              <div className="h-full overflow-y-auto p-6 bg-gray-900 text-gray-300 font-mono text-sm">
                {executing ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
                    <p className="text-gray-500">Executing code against test cases...</p>
                  </div>
                ) : results ? (
                  <div className="space-y-6">
                    {results.error ? (
                      <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400">
                        {results.error}
                      </div>
                    ) : (
                      <>
                        <div className={`p-4 rounded-lg flex items-center space-x-3 ${results.passed ? 'bg-green-900/20 border border-green-900/50 text-green-400' : 'bg-red-900/20 border border-red-900/50 text-red-400'}`}>
                          {results.passed ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                          <span className="font-bold text-lg">{results.passed ? 'All Tests Passed!' : 'Some Tests Failed'}</span>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="text-white font-bold uppercase text-xs tracking-widest opacity-50">Test Results</h4>
                          {results.results.map((res, idx) => (
                            <div key={idx} className="p-4 bg-black/40 rounded-lg border border-gray-800">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-gray-500">Test Case #{idx + 1}</span>
                                {res.passed ? (
                                  <span className="text-green-500 flex items-center text-xs font-bold"><CheckCircle2 className="w-3 h-3 mr-1" /> PASSED</span>
                                ) : (
                                  <span className="text-red-500 flex items-center text-xs font-bold"><XCircle className="w-3 h-3 mr-1" /> FAILED</span>
                                )}
                              </div>
                              {res.isHidden ? (
                                <p className="text-xs italic text-gray-600 italic">Hidden test case results are masked.</p>
                              ) : (
                                <div className="space-y-2 text-xs">
                                  {res.input && <div><span className="text-gray-500">Input:</span> <code className="text-blue-400">{res.input}</code></div>}
                                  <div><span className="text-gray-500">Expected:</span> <code className="text-green-400">{res.expected}</code></div>
                                  <div><span className="text-gray-500">Actual:</span> <code className={res.passed ? 'text-green-400' : 'text-red-400'}>{res.actual || 'No output'}</code></div>
                                  {res.error && <div className="mt-2 p-2 bg-red-900/40 text-red-300 rounded overflow-x-auto">{res.error}</div>}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-600">
                    <Play className="w-12 h-12 mb-4 opacity-20" />
                    <p>Run your code to see the test results here.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeLab;