import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import type { Course } from '../../../utils/api';
import HomeNav from '../../User/home/components/HomeNav';
import { 
  Plus, Edit2, Trash2, Save, X, Image as ImageIcon, 
  Type, Loader2, ArrowLeft, Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserEntry {
  _id: string;
  name: string;
  email: string;
  role: string;
  assignedCourses: string[];
}

const ManageCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<UserEntry[]>([]);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedCourseForAssign, setSelectedCourseForAssign] = useState<Course | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesData, usersData] = await Promise.all([
        api.getAllCourses(),
        fetch('/api/users', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }).then(res => res.json()).catch(() => [])
      ]);
      setCourses(coursesData);
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse({ ...course });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingCourse({
      title: '',
      tag: '',
      description: '',
      image: '',
      passingThreshold: 70,
      templates: [{ title: '', prompt: '', icon: '' }],
      assessment: { question: '', options: ['', '', ''], correctAnswer: '' }
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await api.adminDeleteCourse(id);
        setCourses(courses.filter(c => c._id !== id));
      } catch (error) {
        alert('Failed to delete course');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingCourse._id) {
        await api.adminUpdateCourse(editingCourse._id, editingCourse);
      } else {
        await api.adminCreateCourse(editingCourse);
      }
      fetchData();
      setIsModalOpen(false);
    } catch (error) {
      alert('Failed to save course');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignClick = (course: Course) => {
    setSelectedCourseForAssign(course);
    setSelectedUserIds([]);
    setIsAssignModalOpen(true);
  };

  const handleAssignSubmit = async () => {
    if (!selectedCourseForAssign || selectedUserIds.length === 0) return;
    setIsSubmitting(true);
    try {
      await Promise.all(selectedUserIds.map(userId => 
        api.assignCourseToUser(userId, selectedCourseForAssign._id)
      ));
      alert('Course assigned successfully to selected users!');
      setIsAssignModalOpen(false);
    } catch (error) {
      alert('Failed to assign course');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingCourse({ ...editingCourse, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans selection:bg-brand-primary/30">
      <HomeNav />
      
      <main className="max-w-7xl mx-auto pt-32 px-6 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <button 
              onClick={() => navigate('/admin')}
              className="flex items-center text-brand-text/50 hover:text-brand-primary transition-colors mb-4 group font-black text-xs uppercase tracking-widest"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Stats
            </button>
            <h1 className="text-4xl font-black tracking-tight mb-2 text-brand-text italic">Manage <span className="text-brand-primary">Courses</span></h1>
            <p className="text-brand-text/50 font-medium">Add, edit, or remove curriculum content</p>
          </div>
          <button 
            onClick={handleAddNew}
            className="px-8 py-4 bg-brand-primary hover:opacity-90 text-white rounded-2xl transition-all flex items-center gap-2 font-black italic uppercase tracking-widest shadow-xl shadow-brand-primary/20"
          >
            <Plus className="w-6 h-6" />
            Create New Course
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div key={course._id} className="bg-white border border-brand-primary/10 rounded-3xl overflow-hidden group hover:border-brand-primary/30 transition-all flex flex-col shadow-sm hover:shadow-md">
              <div className="aspect-video relative overflow-hidden bg-brand-secondary/10 flex items-center justify-center">
                {course.image ? (
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <ImageIcon className="w-12 h-12 text-brand-text/10" />
                )}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/80 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-brand-primary border border-brand-primary/10 shadow-sm">
                    {course.tag}
                  </span>
                </div>
              </div>
              
              <div className="p-8 flex-grow">
                <h3 className="text-xl font-black italic text-brand-text mb-2">{course.title}</h3>
                <p className="text-brand-text/60 text-sm line-clamp-2 mb-6 font-medium leading-relaxed">{course.description}</p>
                
                <div className="flex items-center gap-4 pt-4 border-t border-brand-primary/5">
                  <button 
                    onClick={() => handleEdit(course)}
                    className="flex-grow flex items-center justify-center gap-2 py-3 bg-white hover:bg-brand-secondary/5 border border-brand-primary/10 rounded-xl transition-all font-black italic uppercase tracking-widest text-[10px] text-brand-text shadow-sm"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button 
                    onClick={() => handleAssignClick(course)}
                    className="flex-grow flex items-center justify-center gap-2 py-3 bg-brand-primary/10 hover:bg-brand-primary/20 border border-brand-primary/20 text-brand-primary rounded-xl transition-all font-black italic uppercase tracking-widest text-[10px]"
                  >
                    <Users className="w-3.5 h-3.5" /> Assign
                  </button>
                  <button 
                    onClick={() => handleDelete(course._id)}
                    className="p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-brand-bg/60 animate-in fade-in duration-300">
          <div className="bg-white border border-brand-primary/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl relative">
            <div className="sticky top-0 bg-white/90 backdrop-blur-md p-8 border-b border-brand-primary/5 flex justify-between items-center z-10">
              <h2 className="text-2xl font-black tracking-tight italic text-brand-text">
                {editingCourse._id ? 'Edit' : 'Create'} <span className="text-brand-primary">Course</span>
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-brand-secondary/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-brand-text/40" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Visuals */}
                <div className="space-y-6">
                  <div className="aspect-video rounded-3xl bg-brand-secondary/5 border-2 border-dashed border-brand-primary/10 flex flex-col items-center justify-center relative overflow-hidden group">
                    {editingCourse.image ? (
                      <img src={editingCourse.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center text-brand-text/20">
                        <ImageIcon className="w-12 h-12 mb-2" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Course Thumbnail</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-brand-bg/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <label className="cursor-pointer bg-brand-primary text-white px-6 py-2 rounded-full font-black italic uppercase tracking-widest text-[10px] hover:scale-105 transition-transform shadow-lg shadow-brand-primary/20">
                        Upload Image
                        <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text/40 px-1">Tag</label>
                       <input 
                         required
                         value={editingCourse.tag}
                         onChange={(e) => setEditingCourse({...editingCourse, tag: e.target.value})}
                         className="w-full bg-brand-secondary/5 border border-brand-primary/10 rounded-xl px-4 py-3 focus:border-brand-primary/50 outline-none transition-colors text-brand-text font-bold"
                         placeholder="e.g. MATHS"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text/40 px-1">Threshold (%)</label>
                       <input 
                         type="number"
                         required
                         min="0" max="100"
                         value={editingCourse.passingThreshold}
                         onChange={(e) => setEditingCourse({...editingCourse, passingThreshold: parseInt(e.target.value)})}
                         className="w-full bg-brand-secondary/5 border border-brand-primary/10 rounded-xl px-4 py-3 focus:border-brand-primary/50 outline-none transition-colors text-brand-text font-bold"
                       />
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text/40 px-1">Title</label>
                    <div className="flex items-center bg-brand-secondary/5 border border-brand-primary/10 rounded-xl px-4 py-1 focus-within:border-brand-primary/50 transition-colors">
                      <Type className="w-4 h-4 text-brand-text/20 mr-2" />
                      <input 
                        required
                        value={editingCourse.title}
                        onChange={(e) => setEditingCourse({...editingCourse, title: e.target.value})}
                        className="w-full bg-transparent py-3 outline-none text-brand-text font-bold"
                        placeholder="Course title"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text/40 px-1">Description</label>
                    <div className="bg-brand-secondary/5 border border-brand-primary/10 rounded-xl px-4 py-3 focus-within:border-brand-primary/50 transition-colors">
                      <textarea 
                        required
                        rows={5}
                        value={editingCourse.description}
                        onChange={(e) => setEditingCourse({...editingCourse, description: e.target.value})}
                        className="w-full bg-transparent outline-none resize-none text-sm text-brand-text font-medium leading-relaxed"
                        placeholder="What will students learn?"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Assessment Section */}
              <div className="space-y-6 pt-8 border-t border-brand-primary/5">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary italic">Course Assessment</h3>
                <div className="p-8 bg-brand-secondary/5 rounded-[2rem] border border-brand-primary/10 space-y-5">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text/40 px-1">Question</label>
                     <input 
                       required
                       value={editingCourse.assessment.question}
                       onChange={(e) => setEditingCourse({
                         ...editingCourse, 
                         assessment: { ...editingCourse.assessment, question: e.target.value } 
                       })}
                       className="w-full bg-white border border-brand-primary/10 rounded-xl px-5 py-4 outline-none focus:border-brand-primary/50 transition-colors text-brand-text font-bold"
                     />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {editingCourse.assessment.options.map((opt: string, idx: number) => (
                      <div key={idx} className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text/40 px-1">Option {idx + 1}</label>
                        <input 
                          required
                          value={opt}
                          onChange={(e) => {
                            const newOpts = [...editingCourse.assessment.options];
                            newOpts[idx] = e.target.value;
                            setEditingCourse({
                              ...editingCourse,
                              assessment: { ...editingCourse.assessment, options: newOpts }
                            });
                          }}
                          className="w-full bg-white border border-brand-primary/10 rounded-xl px-5 py-3 outline-none focus:border-brand-primary/50 transition-colors text-sm text-brand-text font-medium"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="pt-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text/40 block mb-2 px-1">Correct Answer</label>
                    <select 
                      value={editingCourse.assessment.correctAnswer}
                      onChange={(e) => setEditingCourse({
                        ...editingCourse,
                        assessment: { ...editingCourse.assessment, correctAnswer: e.target.value }
                      })}
                      className="w-full bg-brand-primary/10 border border-brand-primary/30 rounded-xl px-5 py-4 outline-none font-black italic uppercase tracking-widest text-brand-primary appearance-none cursor-pointer"
                    >
                      <option value="" className="text-brand-text/40">Select the correct option...</option>
                      {editingCourse.assessment.options.map((opt: string) => (
                        <option key={opt} value={opt} className="bg-white text-brand-text py-2">{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-8 flex justify-end gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-4 font-black italic uppercase tracking-widest text-[10px] text-brand-text/40 hover:text-brand-primary transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-12 py-4 bg-brand-primary hover:opacity-90 disabled:opacity-50 text-white rounded-2xl font-black italic uppercase tracking-[0.2em] transition-all shadow-xl shadow-brand-primary/20 flex items-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-brand-bg/60 animate-in fade-in duration-300">
          <div className="bg-white border border-brand-primary/10 w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative">
            <div className="p-8 border-b border-brand-primary/5 flex justify-between items-center bg-brand-secondary/5 rounded-t-[2.5rem]">
              <div>
                <h2 className="text-2xl font-black tracking-tight italic text-brand-text">Assign <span className="text-brand-primary">Course</span></h2>
                <p className="text-[10px] text-brand-text/40 font-black uppercase tracking-widest mt-1">Course: {selectedCourseForAssign?.title}</p>
              </div>
              <button onClick={() => setIsAssignModalOpen(false)} className="p-2 hover:bg-brand-secondary/10 rounded-full transition-colors">
                <X className="w-6 h-6 text-brand-text/40" />
              </button>
            </div>

            <div className="p-8 max-h-[50vh] overflow-y-auto space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-text/40 mb-4 px-1">Select Students</p>
              {users.length === 0 ? (
                <p className="text-brand-text/30 italic py-10 text-center font-medium">No students found matching your criteria.</p>
              ) : (
                users.map(user => (
                  <label key={user._id} className="flex items-center justify-between p-5 bg-brand-secondary/5 border border-brand-primary/5 rounded-2xl cursor-pointer hover:bg-brand-primary/5 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-black">{user.name[0]}</div>
                      <div>
                        <p className="font-black italic text-brand-text">{user.name}</p>
                        <p className="text-xs text-brand-text/40 font-medium">{user.email}</p>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      className="w-6 h-6 rounded-lg border-brand-primary/20 bg-white text-brand-primary focus:ring-brand-primary/50 transition-all cursor-pointer"
                      checked={selectedUserIds.includes(user._id)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedUserIds([...selectedUserIds, user._id]);
                        else setSelectedUserIds(selectedUserIds.filter(id => id !== user._id));
                      }}
                    />
                  </label>
                ))
              )}
            </div>

            <div className="p-8 border-t border-brand-primary/5 flex justify-end gap-4 bg-brand-secondary/5 rounded-b-[2.5rem]">
              <button onClick={() => setIsAssignModalOpen(false)} className="px-8 py-4 font-black italic uppercase tracking-widest text-[10px] text-brand-text/40 hover:text-brand-primary">Cancel</button>
              <button 
                onClick={handleAssignSubmit}
                disabled={isSubmitting || selectedUserIds.length === 0}
                className="px-12 py-4 bg-brand-primary hover:opacity-90 disabled:opacity-50 text-white rounded-2xl font-black italic uppercase tracking-widest transition-all shadow-xl shadow-brand-primary/20 flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                Confirm Assignment ({selectedUserIds.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCourses;
