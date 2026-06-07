import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminAPI } from "../api/adminApi";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiX } from "react-icons/fi";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [addingSubject, setAddingSubject] = useState(false);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
   const [notification, setNotification] = useState("");
     const showNotification = (message) => {
      setNotification(message);
  
      setTimeout(() => {
        setNotification("");
      }, 3000);
    };
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await adminAPI.getMessages();
      setMessages(data);
    } catch (err) {
      toast.error("Failed to load messages ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleRead = async (id) => {
    try {
      await adminAPI.markMessageRead(id);

      // update UI instantly
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, is_read: true } : m)),
      );
      showNotification("Marked as read ");
    } catch {
      toast.error("Failed ❌");
    }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubject.trim()) {
      toast.error("Subject name cannot be empty");
      return;
    }

    setAddingSubject(true);
    try {
      const newSub = await adminAPI.addSubject(newSubject.trim());
      setSubjects((prev) => [...prev, newSub]);
      setNewSubject("");
      showNotification("Subject added successfully ");
    } catch (error) {
      toast.error("Failed to add subject ❌");
    } finally {
      setAddingSubject(false);
    }
  };

  const handleDeleteSubject = async (id) => {
    try {
      await adminAPI.deleteSubject(id);
      setSubjects((prev) => prev.filter((s) => s.id !== id));
      showNotification("Subject deleted ");
    } catch {
      toast.error("Failed to delete subject ❌");
    }
  };

  const fetchSubjects = async () => {
    try {
      const data = await adminAPI.getSubjects();
      setSubjects(data);
    } catch (error) {
      toast.error("Failed to load subjects");
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
      <>
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
            }}
            className="fixed inset-x-0 top-24 z-[9999] flex justify-center px-4"
          >
            <div className="bg-white shadow-xl rounded-xl px-5 py-4 flex items-center gap-3 max-w-md w-full">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <FiCheckCircle className="text-emerald-600" size={18} />
              </div>
    
              <p className="flex-1 text-gray-800 text-sm font-medium">
                {notification}
              </p>
    
              <button
                onClick={() => setNotification("")}
                className="text-gray-500 hover:text-black"
              >
                <FiX size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    <div className="text-white">
      <h1 className="text-4xl font-bold text-white"> Customer Messages</h1>

      {/* SUBJECT MANAGEMENT */}
      <div className="bg-slate-900 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Manage Message Subjects</h2>

        {/* ADD SUBJECT FORM */}
        <form onSubmit={handleAddSubject} className="mb-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="Enter new subject name"
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
              disabled={addingSubject}
            />
            <button
              type="submit"
              disabled={addingSubject || !newSubject.trim()}
              className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:cursor-not-allowed px-6 py-2 rounded-lg font-semibold transition"
            >
              {addingSubject ? "Adding..." : "Add Subject"}
            </button>
          </div>
        </form>

        {/* SUBJECTS LIST */}
        <div>
          <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
            Existing Subjects ({subjects.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {subjects.map((sub) => (
              <div
                key={sub.id}
                className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-2 rounded-lg"
              >
                <span className="text-slate-200">{sub.name}</span>
                <button
                  onClick={() => handleDeleteSubject(sub.id)}
                  className="text-red-400 hover:text-red-300 text-sm font-bold transition"
                  title="Delete subject"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          {subjects.length === 0 && (
            <p className="text-slate-400 text-sm mt-2">No subjects found</p>
          )}
        </div>
      </div>

      {/* MESSAGES TABLE */}
      <div className="bg-slate-900 rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-800 text-slate-400">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Subject</th>
              <th className="p-3 text-left">Message</th>
              <th className="p-3 text-left">Received</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center p-6">
                  Loading...
                </td>
              </tr>
            ) : messages.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-6">
                  No messages found
                </td>
              </tr>
            ) : (
              messages.map((msg) => (
                <tr
                  key={msg.id}
                  className={`border-t border-slate-800 ${
                    msg.is_read ? "" : "bg-slate-800/50"
                  }`}
                >
                  <td className="p-3">{msg.name}</td>
                  <td className="p-3">{msg.email}</td>

                  <td className="p-3 font-medium text-cyan-400">
                    {msg.subject_name || "No Subject"}
                  </td>

                  {/* <td className="p-3 max-w-sm">
                                        {expandedId === msg.id ? (
                                            <>
                                                <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                                                <button
                                                    onClick={() => setExpandedId(null)}
                                                    className="text-cyan-400 text-xs mt-1"
                                                >
                                                    Show less
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <p className="truncate">{msg.message}</p>
                                                <button
                                                    onClick={() => setExpandedId(msg.id)}
                                                    className="text-cyan-400 text-xs mt-1"
                                                >
                                                    Read more
                                                </button>
                                            </>
                                        )}
                                    </td> */}
                  <td className="p-3 max-w-sm">
                    {msg.message?.length > 10 ? (
                      expandedId === msg.id ? (
                        <>
                          <p className="whitespace-pre-wrap break-words">
                            {msg.message}
                          </p>

                          <button
                            onClick={() => setExpandedId(null)}
                            className="text-cyan-400 text-xs mt-1"
                          >
                            Show Less
                          </button>
                        </>
                      ) : (
                        <>
                          <p>{msg.message.slice(0, 10)}...</p>

                          <button
                            onClick={() => setExpandedId(msg.id)}
                            className="text-cyan-400 text-xs mt-1"
                          >
                            Read More
                          </button>
                        </>
                      )
                    ) : (
                      <p>{msg.message}</p>
                    )}
                  </td>
                  <td className="p-3 text-slate-400">
                    {new Date(msg.received_at).toLocaleString()}
                  </td>

                  {/* ✅ FIXED POSITION */}
                  <td className="p-3">
                    {!msg.is_read ? (
                      <button
                        onClick={() => handleRead(msg.id)}
                        className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-xs"
                      >
                        Mark as Read
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">Read</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

export default AdminMessages;
