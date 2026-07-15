import streamlit as st

from api import (
    get_current_user,
    get_my_jobs,
    get_recruiter_analytics
)


def show():

    st.title(" Recruiter Profile")

    token = st.session_state.token

    user_response = get_current_user(token)

    analytics_response = get_recruiter_analytics(token)

    jobs_response = get_my_jobs(token)

    if (
        user_response.status_code != 200
        or analytics_response.status_code != 200
        or jobs_response.status_code != 200
    ):

        st.error("Unable to load profile.")

        return

    user = user_response.json()

    analytics = analytics_response.json()

    jobs = jobs_response.json()

    st.subheader("Personal Information")

    st.write(f"**Name:** {user['name']}")

    st.write(f"**Email:** {user['email']}")

    st.write(f"**Role:** {user['role'].title()}")

    st.divider()

    st.subheader("Recruitment Statistics")

    c1, c2, c3 = st.columns(3)

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
            "Average AI Score",
            f"{analytics['average_score']}%"
        )

    st.divider()

    st.subheader("My Posted Jobs")

    if len(jobs) == 0:

        st.info(
            "No jobs posted yet."
        )

    else:

        for job in jobs:

            with st.container(border=True):

                st.subheader(job["title"])

                st.write(
                    f" {job['company']}"
                )

                st.write(
                    f" {job['location']}"
                )

                st.caption(
                    job["required_skills"]
                )