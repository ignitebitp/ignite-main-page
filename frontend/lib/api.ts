const getApiUrl = () => {
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return '';
};

export const API_URL = getApiUrl();

export const api = {
    // Generic fetch wrapper
    async request(endpoint: string, options: RequestInit = {}) {
        const token = localStorage.getItem('ignite_admin_token');

        const headers: Record<string, string> = {
            ...(options.headers as Record<string, string> || {}),
        };

        // Don't set Content-Type for FormData, let browser handle it with boundary
        if (!(options.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
        const text = await res.text();
        let data: any = {};
        try {
            data = text ? JSON.parse(text) : {};
        } catch {
            if (!res.ok) {
                throw new Error(`Server error (${res.status}): received non-JSON response`);
            }
            throw new Error('Unexpected non-JSON response from server');
        }
        if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
        return data;
    },

    get: (endpoint: string) => api.request(endpoint),
    post: (endpoint: string, body: any) => api.request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
    put: (endpoint: string, body: any) => api.request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (endpoint: string) => api.request(endpoint, { method: 'DELETE' }),

    // Auth
    login: (data: any) => api.request('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    changePassword: (data: { currentPassword: string; newPassword: string }) =>
        api.request('/api/auth/change-password', { method: 'POST', body: JSON.stringify(data) }),
    resetOwnerPassword: (data: { email: string; recoveryPassword: string; newPassword: string }) =>
        api.request('/api/auth/reset-password', { method: 'POST', body: JSON.stringify(data) }),
    getInviteStatus: (params: { token?: string; email?: string }) => {
        const qs = new URLSearchParams();
        if (params.token) qs.set('token', params.token);
        if (params.email) qs.set('email', params.email);
        return api.request(`/api/auth/invite-status?${qs.toString()}`);
    },
    setupPassword: (data: { token?: string; email?: string; password: string; name?: string }) =>
        api.request('/api/auth/setup-password', { method: 'POST', body: JSON.stringify(data) }),
    updateProfileName: (name: string) =>
        api.request('/api/auth/profile', { method: 'PATCH', body: JSON.stringify({ name }) }),
    verifyToken: () => api.request('/api/auth/verify'),

    // Recruitment
    submitApplication: (data: any) => api.request('/api/recruit', { method: 'POST', body: JSON.stringify(data) }),
    getApplications: () => api.request('/api/recruit'),
    updateApplicationStatus: (id: string, status: string) => api.request(`/api/recruit/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    deleteApplication: (id: string) => api.request(`/api/recruit/${id}`, { method: 'DELETE' }),

    // Events
    getEvents: () => api.request('/api/events'),
    getAllEvents: () => api.request('/api/events/all'),
    createEvent: (data: any) => api.request('/api/events', {
        method: 'POST',
        body: data instanceof FormData ? data : JSON.stringify(data)
    }),
    updateEvent: (id: string, data: any) => api.request(`/api/events/${id}`, {
        method: 'PUT',
        body: data instanceof FormData ? data : JSON.stringify(data)
    }),
    deleteEvent: (id: string) => api.request(`/api/events/${id}`, { method: 'DELETE' }),
    registerForEvent: (data: any) => api.request('/api/events/register', { method: 'POST', body: JSON.stringify(data) }),
    getRegistrations: () => api.request('/api/events/registrations'),

    // Exam
    addQuestion: (data: any) => api.request('/api/exam/questions', { method: 'POST', body: JSON.stringify(data) }),
    addQuestionsBulk: (questions: any[]) => api.request('/api/exam/questions/bulk', { method: 'POST', body: JSON.stringify({ questions }) }),
    generateQuestions: (topic: string, count: number = 5) => api.request('/api/exam/questions/generate', { method: 'POST', body: JSON.stringify({ topic, count }) }),
    getAllQuestions: () => api.request('/api/exam/questions/all'),
    updateQuestion: (id: string, data: any) => api.request(`/api/exam/questions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteQuestion: (id: string) => api.request(`/api/exam/questions/${id}`, { method: 'DELETE' }),
    startExam: (data: any) => api.request('/api/exam/start', { method: 'POST', body: JSON.stringify(data) }),
    submitExam: (data: any) => api.request('/api/exam/submit', { method: 'POST', body: JSON.stringify(data) }),
    logViolation: (data: any) => api.request('/api/exam/violation', { method: 'POST', body: JSON.stringify(data) }),
    sendExamWarning: (submissionId: string, message: string) => api.request('/api/exam/warning', { method: 'POST', body: JSON.stringify({ submissionId, message }) }),
    getExamStatus: (submissionId: string) => api.request(`/api/exam/status/${submissionId}`),
    getExamConfig: () => api.request('/api/exam/config'),
    updateExamConfig: (data: any) => api.request('/api/exam/config', { method: 'POST', body: JSON.stringify(data) }),
    getSubmissions: () => api.request('/api/exam/submissions'),
    getActiveExams: () => api.request('/api/exam/active'),
    addExamTime: (data: { submissionId: string, minutes: number }) => api.request('/api/exam/add-time', { method: 'POST', body: JSON.stringify(data) }),
    addExamTimeAll: (minutes: number) => api.request('/api/exam/add-time-all', { method: 'POST', body: JSON.stringify({ minutes }) }),
    resetAllSubmissions: () => api.request('/api/exam/reset-all', { method: 'DELETE' }),
    clearAllQuestions: () => api.request('/api/exam/questions/clear-all', { method: 'DELETE' }),
    exportResultsCSVUrl: () => `${API_URL}/api/exam/export?token=${localStorage.getItem('ignite_admin_token')}`,
    forceSubmitExam: (submissionId: string) => api.request('/api/exam/force-submit', { method: 'POST', body: JSON.stringify({ submissionId }) }),
    syncAnswers: (data: { submissionId: string, answers: any[] }) => api.request('/api/exam/update-answers', { method: 'POST', body: JSON.stringify(data) }),
    resetSubmission: (id: string) => api.request(`/api/exam/submission/${id}`, { method: 'DELETE' }),
    getAllowlist: () => api.request('/api/exam/allowlist'),
    addToAllowlist: (data: any) => api.request('/api/exam/allowlist', { method: 'POST', body: JSON.stringify(data) }),
    getProfile: (email: string) => api.request(`/api/user/profile/${email}`),
    getEventQR: (id: string) => api.request(`/api/events/${id}/qr`),
    markAttendance: (data: { eventId: string, email: string }) => api.request('/api/events/attend', { method: 'POST', body: JSON.stringify(data) }),
    uploadCertificateTemplate: (id: string, data: FormData) => api.request(`/api/events/${id}/certificate-template`, { method: 'POST', body: data }),
    previewCertificate: (id: string) => api.request(`/api/events/${id}/certificate-preview`),
    generateCertificates: (id: string) => api.request(`/api/events/${id}/generate-certificates`, { method: 'POST' }),

    // Gallery
    getGallery: () => api.request('/api/gallery'),
    addGalleryItem: (data: FormData) => api.request('/api/gallery', { method: 'POST', body: data }),
    updateGalleryItem: (id: string, data: FormData) => api.request(`/api/gallery/${id}`, { method: 'PUT', body: data }),
    deleteGalleryItem: (id: string) => api.request(`/api/gallery/${id}`, { method: 'DELETE' }),

    // Team
    getTeam: () => api.request('/api/team'),
    getAllTeam: () => api.request('/api/team/all'),
    addTeamMember: (data: any) => api.request('/api/team', { method: 'POST', body: JSON.stringify(data) }),
    updateTeamMember: (id: string, data: any) => api.request(`/api/team/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteTeamMember: (id: string) => api.request(`/api/team/${id}`, { method: 'DELETE' }),

    // Admin Users & Mailer
    getAdminUsers: () => api.request('/api/admin/users'),
    addAdminUser: (data: { email: string; name?: string; role: 'admin' | 'moderator' }) =>
        api.request('/api/admin/users', { method: 'POST', body: JSON.stringify(data) }),
    updateStaffRole: (id: string, role: 'admin' | 'moderator') =>
        api.request(`/api/admin/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
    resetStaffPassword: (id: string, newPassword: string) =>
        api.request(`/api/admin/users/${id}/reset-password`, { method: 'POST', body: JSON.stringify({ newPassword }) }),
    deleteAdminUser: (id: string) => api.request(`/api/admin/users/${id}`, { method: 'DELETE' }),
    getResendStatus: () => api.request('/api/admin/resend-status'),
    sendAdminEmail: (data: { to?: string; subject: string; message?: string; html?: string; targetGroup?: string }) =>
        api.request('/api/admin/send-email', { method: 'POST', body: JSON.stringify(data) }),

    // Contact & Student Interest (/register)
    submitContactMessage: (data: { name: string; email: string; subject?: string; message: string }) =>
        api.request('/api/contact', { method: 'POST', body: JSON.stringify(data) }),
    submitStudentInterest: (data: { name: string; email: string; phone?: string; branch?: string; batch?: string; message?: string }) =>
        api.request('/api/contact/interest', { method: 'POST', body: JSON.stringify(data) }),
    getContactMessages: () => api.request('/api/contact'),
    deleteContactMessage: (id: string) => api.request(`/api/contact/${id}`, { method: 'DELETE' }),

    // Upload
    uploadBlob: (formData: FormData) => api.request('/api/upload', { method: 'POST', body: formData }),

    // System Config
    getConfig: (key: string) => api.request(`/api/config/${key}`),
    setConfig: (key: string, value: any) => api.request('/api/config', { method: 'POST', body: JSON.stringify({ key, value }) }),
};
