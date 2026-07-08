import streamlit as st

from auth.login_page import show as login_page
from auth.register_page import show as register_page

from candidate.dashboard import show as candidate_dashboard
from candidate.browse_jobs import show as browse_jobs
from candidate.my_applications import show as my_applications
from candidate.resume_analyzer import show as resume_analyzer

from recruiter.dashboard import show as recruiter_dashboard
from recruiter.create_job import show as create_job
from recruiter.my_jobs import show as my_jobs
from recruiter.edit_job import show as edit_job
from recruiter.profile import show as recruiter_profile
from recruiter.applicants import show as applicants

from admin.admin_dashboard import show as admin_dashboard
from admin.profile import show as admin_profile

st.set_page_config(
    page_title="AI Resume Screening",
    layout="wide"
)

# -----------------------------
# Session Initialization
# -----------------------------
if "page" not in st.session_state:
    st.session_state.page = "Home"

# -----------------------------
# Header
# -----------------------------
st.title(" AI Resume Screening System")

st.divider()

# ======================================================
# BEFORE LOGIN
# ======================================================

if "user" not in st.session_state:

    c1, c2, c3 = st.columns(3)

    if c1.button(" Home", use_container_width=True):
        st.session_state.page = "Home"

    if c2.button(" Login", use_container_width=True):
        st.session_state.page = "Login"

    if c3.button(" Register", use_container_width=True):
        st.session_state.page = "Register"

    st.divider()

    if st.session_state.page == "Home":

        st.header("Welcome!")

        st.write("""
### AI Resume Screening System

This portal allows:

- Recruiters to post jobs
- Candidates to apply
- AI to rank resumes automatically
- Recruiters to shortlist top candidates
""")

    elif st.session_state.page == "Login":

        login_page()

    elif st.session_state.page == "Register":

        register_page()

# ======================================================
# AFTER LOGIN
# ======================================================

else:

    role = st.session_state.user["role"]

    st.success(
        f"Logged in as {st.session_state.user['name']} ({role.title()})"
    )

    # -----------------------------
    # Candidate Navigation
    # -----------------------------

    if role == "candidate":

        c1, c2, c3, c4, c5, c6 = st.columns(6)

        if c1.button(" Dashboard", use_container_width=True):
            st.session_state.page = "Dashboard"

        if c2.button(" Browse Jobs", use_container_width=True):
            st.session_state.page = "Browse Jobs"

        if c3.button(" My Applications", use_container_width=True):
            st.session_state.page = "My Applications"

        if c4.button("Resume Analyzer", use_container_width=True):
            st.session_state.page = "Resume Analyzer"
        
        if c5.button(" Profile", use_container_width=True):
            st.session_state.page = "Profile"

        if c6.button(" Logout", use_container_width=True):
            st.session_state.clear()
            st.rerun()

        st.divider()

        if st.session_state.page == "Dashboard":

            candidate_dashboard()

        elif st.session_state.page == "Browse Jobs":

            browse_jobs()

        elif st.session_state.page == "My Applications":

            my_applications()

        elif st.session_state.page == "Resume Analyzer":

            resume_analyzer()
        
        elif st.session_state.page == "Profile":

            from candidate.profile import show

            show()

    # -----------------------------
    # Admin Navigation
    # -----------------------------

    elif role == "admin":

        c1, c2, c3 = st.columns(3)

        if c1.button(" Dashboard", use_container_width=True):
            st.session_state.page = "Dashboard"

        if c2.button(" Profile", use_container_width=True):
            st.session_state.page = "Profile"

        if c3.button(" Logout", use_container_width=True):
            st.session_state.clear()
            st.rerun()

        st.divider()

        if st.session_state.page == "Dashboard":

            admin_dashboard()

        elif st.session_state.page == "Profile":

            admin_profile()

        else:

            admin_dashboard()

    # -----------------------------
    # Recruiter Navigation
    # -----------------------------

    else:

        c1, c2, c3, c4, c5, c6 = st.columns(6)

        if c1.button(" Dashboard", use_container_width=True):
            st.session_state.page = "Dashboard"

        if c2.button(" My Jobs", use_container_width=True):
            st.session_state.page = "My Jobs"

        if c3.button(" Create Job", use_container_width=True):
            st.session_state.page = "Create Job"

        if c4.button(" Applicants", use_container_width=True):
            st.session_state.page = "Applicants"
        
        if c5.button("Profile", use_container_width=True):
            st.session_state.page = "Profile"

        if c6.button(" Logout", use_container_width=True):
            st.session_state.clear()
            st.rerun()

        st.divider()

        if st.session_state.page == "Dashboard":

            recruiter_dashboard()

        elif st.session_state.page == "My Jobs":

            my_jobs()

        elif st.session_state.page == "Edit Job":

            edit_job()

        elif st.session_state.page == "Create Job":

            create_job()

        elif st.session_state.page == "Applicants":

            applicants()
        
        elif st.session_state.page == "Profile":

            recruiter_profile()