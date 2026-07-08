import streamlit as st
from api import get_jobs, get_my_applications

def show():

    st.title(" Candidate Dashboard")

    st.success(
        f"Welcome, {st.session_state.user['name']} "
    )

    token = st.session_state.token

    # ----------------------------
    # Load Jobs
    # ----------------------------

    jobs_response = get_jobs(token)

    if jobs_response.status_code == 200:
        jobs = jobs_response.json()
    else:
        jobs = []

    # ----------------------------
    # Load Applications
    # ----------------------------

    app_response = get_my_applications(token)

    if app_response.status_code == 200:
        applications = app_response.json()
    else:
        applications = []

    total_jobs = len(jobs)
    total_applications = len(applications)

    pending = len([
        a for a in applications
        if a["status"] == "Pending"
    ])

    shortlisted = len([
        a for a in applications
        if a["status"] == "Shortlisted"
    ])

    c1, c2, c3 = st.columns(3)

    c1.metric(
        " Jobs",
        total_jobs
    )

    c2.metric(
        " Applications",
        total_applications
    )

    c3.metric(
        "Shortlisted",
        shortlisted
    )

    st.divider()

    st.subheader("Recent Applications")

    if not applications:

        st.info(
            "You haven't applied to any jobs yet."
        )

    else:

        recent = applications[-3:]

        for app in reversed(recent):

            with st.container(border=True):

                st.write(
                    f"### {app['job']['title']}"
                )

                st.write(
                    f" {app['job']['company']}"
                )

                st.write(
                    f" {app['job']['location']}"
                )

                st.write(
                    f"Status: **{app['status']}**"
                )

    st.divider()

    st.info(
        "Browse Jobs, Upload Resume and View All Applications using the navigation menu."
    )