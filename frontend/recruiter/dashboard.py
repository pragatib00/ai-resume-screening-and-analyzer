import streamlit as st

from api import (
    get_recruiter_analytics,
    get_my_jobs
)


def show():

    st.title("Recruiter Dashboard")

    st.success(
        f"Welcome, {st.session_state.user['name']}!"
    )

    token = st.session_state.token

    # ---------------------------------
    # Load Analytics
    # ---------------------------------

    analytics_response = get_recruiter_analytics(token)

    if analytics_response.status_code != 200:

        st.error("Unable to load dashboard.")

        return

    analytics = analytics_response.json()

    # ---------------------------------
    # Dashboard Cards
    # ---------------------------------

    c1, c2, c3, c4 = st.columns(4)

    with c1:

        st.metric(
            "Jobs Posted",
            analytics["jobs_posted"]
        )

    with c2:

        st.metric(
            "Applications",
            analytics["applications"]
        )

    with c3:

        st.metric(
            "Shortlisted",
            analytics["shortlisted"]
        )

    with c4:

        st.metric(
            "Avg AI Score",
            f"{analytics['average_score']}%"
        )

    st.divider()

    # ---------------------------------
    # Status Overview
    # ---------------------------------

    st.subheader("Application Status")

    s1, s2, s3 = st.columns(3)

    with s1:

        st.success(
            f"Shortlisted\n\n{analytics['shortlisted']}"
        )

    with s2:

        st.warning(
            f"Pending\n\n{analytics['pending']}"
        )

    with s3:

        st.error(
            f"Rejected\n\n{analytics['rejected']}"
        )

    st.divider()

    # ---------------------------------
    # Recent Jobs
    # ---------------------------------

    st.subheader("My Jobs")

    jobs_response = get_my_jobs(token)

    if jobs_response.status_code != 200:

        st.error("Unable to load jobs.")

        return

    jobs = jobs_response.json()

    if len(jobs) == 0:

        st.info(
            "You haven't posted any jobs yet."
        )

    else:

        for job in jobs:

            with st.container(border=True):

                st.subheader(job["title"])

                st.write(
                    f"{job['company']}"
                )

                st.write(
                    f"{job['location']}"
                )

                st.caption(
                    job["required_skills"]
                )

                if st.button(
                    "View Applicants",
                    key=f"job_{job['id']}"
                ):

                    st.session_state.selected_job = job

                    st.session_state.page = "Applicants"

                    st.rerun()

    st.divider()

    # ---------------------------------
    # Quick Insights
    # ---------------------------------

    st.subheader(" AI Insights")

    if analytics["applications"] == 0:

        st.info(
            "No applications received yet."
        )

    else:

        if analytics["average_score"] >= 80:

            st.success(
                "Excellent candidate pool! Average AI score is above 80%."
            )

        elif analytics["average_score"] >= 60:

            st.warning(
                "Average candidate quality is moderate."
            )

        else:

            st.error(
                "Candidate quality is low. Consider revising the job description."
            )