import React, { useState } from 'react';
import { Mail, Send, Sparkles, Users, Edit3, Check, X, Plus, Trash2 } from 'lucide-react';

interface Email {
  subject: string;
  content: string;
}

interface Recipient {
  id: string;
  email: string;
  name?: string;
}

function App() {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState<Email | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setSending] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableEmail, setEditableEmail] = useState<Email | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const addRecipient = () => {
    if (!emailInput.trim()) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
      showNotification('error', 'Please enter a valid email address');
      return;
    }

    if (recipients.some(r => r.email === emailInput)) {
      showNotification('error', 'This email is already in the list');
      return;
    }

    const newRecipient: Recipient = {
      id: Date.now().toString(),
      email: emailInput.trim(),
      name: nameInput.trim() || undefined
    };

    setRecipients([...recipients, newRecipient]);
    setEmailInput('');
    setNameInput('');
    showNotification('success', 'Recipient added successfully');
  };

  const removeRecipient = (id: string) => {
    setRecipients(recipients.filter(r => r.id !== id));
  };

  const generateEmail = async () => {
    if (!prompt.trim()) {
      showNotification('error', 'Please enter a prompt for email generation');
      return;
    }

    setIsGenerating(true);
    try {
      const apiUrl = process.env.VITE_API_URL || 'https://ai-emailwriter.onrender.com';
      const response = await fetch(`${apiUrl}/api/generate-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate email');
      }

      const data = await response.json();
      setGeneratedEmail(data);
      setEditableEmail(data);
      showNotification('success', 'Email generated successfully!');
    } catch (error) {
      showNotification('error', 'Failed to generate email. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  const saveEdits = () => {
    setGeneratedEmail(editableEmail);
    setIsEditing(false);
    showNotification('success', 'Email updated successfully');
  };

  const cancelEdits = () => {
    setEditableEmail(generatedEmail);
    setIsEditing(false);
  };

  const sendEmails = async () => {
    if (!generatedEmail) {
      showNotification('error', 'Please generate an email first');
      return;
    }

    if (recipients.length === 0) {
      showNotification('error', 'Please add at least one recipient');
      return;
    }

    setSending(true);
    try {
      const apiUrl = process.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/send-emails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipients: recipients.map(r => ({ email: r.email, name: r.name })),
          subject: generatedEmail.subject,
          content: generatedEmail.content,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send emails');
      }

      showNotification('success', `Emails sent successfully to ${recipients.length} recipient(s)!`);
    } catch (error) {
      showNotification('error', 'Failed to send emails. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Email Sender</h1>
              <p className="text-sm text-gray-600">Generate and send personalized emails with AI</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-20 right-6 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}>
          {notification.type === 'success' ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
          <span>{notification.message}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Input Section */}
          <div className="space-y-6">
            {/* Recipients Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Users className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Recipients</h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Name (optional)"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addRecipient()}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <button
                  onClick={addRecipient}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Recipient</span>
                </button>

                {recipients.length > 0 && (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {recipients.map((recipient) => (
                      <div key={recipient.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{recipient.email}</div>
                          {recipient.name && <div className="text-sm text-gray-600">{recipient.name}</div>}
                        </div>
                        <button
                          onClick={() => removeRecipient(recipient.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Prompt Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-900">Email Prompt</h2>
              </div>

              <textarea
                placeholder="Describe the email you want to generate... (e.g., 'Write a professional follow-up email for a job interview')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              />

              <button
                onClick={generateEmail}
                disabled={isGenerating || !prompt.trim()}
                className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 px-4 rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generate Email</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column - Generated Email Section */}
          <div className="space-y-6">
            {generatedEmail && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-5 w-5 text-green-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Generated Email</h2>
                  </div>

                  <div className="flex space-x-2">
                    {!isEditing ? (
                      <button
                        onClick={startEditing}
                        className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        <Edit3 className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={saveEdits}
                          className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                        >
                          <Check className="h-4 w-4" />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={cancelEdits}
                          className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <X className="h-4 w-4" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editableEmail?.subject || ''}
                        onChange={(e) => setEditableEmail(prev => prev ? { ...prev, subject: e.target.value } : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="px-3 py-2 bg-gray-50 rounded-lg font-medium">{generatedEmail.subject}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                    {isEditing ? (
                      <textarea
                        value={editableEmail?.content || ''}
                        onChange={(e) => setEditableEmail(prev => prev ? { ...prev, content: e.target.value } : null)}
                        className="w-full h-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    ) : (
                      <div className="px-3 py-2 bg-gray-50 rounded-lg whitespace-pre-wrap min-h-64">{generatedEmail.content}</div>
                    )}
                  </div>
                </div>

                {!isEditing && (
                  <button
                    onClick={sendEmails}
                    disabled={isSending || recipients.length === 0}
                    className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Send to {recipients.length} recipient(s)</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {!generatedEmail && (
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 bg-gray-100 rounded-full">
                    <Mail className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">No Email Generated Yet</h3>
                    <p className="text-gray-600 mt-1">Add recipients and enter a prompt to generate your email</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;