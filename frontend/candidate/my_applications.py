import streamlit as st
from api import get_my_applications

def show():

    st.title(" My Applications")

    token = st.session_state.token

    response = get_my_applications(token)

    if response.status_code != 200:

        st.error("Unable to load applications.")

        return

    applications = response.json()

    if not applications:

        st.info("You haven't applied yet.")

        return

    for app in applications:

        with st.container(border=True):

            st.subheader(app["job"]["title"])

            st.write(
                f" Company : {app['job']['company']}"
            )

            st.write(
                f" Location : {app['job']['location']}"
            )

            st.write("### Status")

            if app["status"] == "Pending":

                st.warning(" Pending")

            elif app["status"] == "Shortlisted":

                st.success(" Shortlisted")

            else:

                st.error(" Rejected")

            st.write("### AI Match Score")

            score = app["match_score"]

            st.progress(score / 100)

            st.success(f"{score}% Match")

            st.write("### Resume")

            if app["resume_path"]:

                st.success(" Resume Uploaded")

            else:

                st.error(" Resume Not Uploaded")

            st.write("### Suggestions")

            if score >= 90:

                st.success(
                    "Excellent match! Your resume closely matches the job."
                )

            elif score >= 70:

                st.info(
                    "Good match. Consider adding more relevant technical skills."
                )

            elif score >= 50:

                st.warning(
                    "Average match. Tailor your resume to the job description."
                )

            else:

                st.error(
                    "Low match. Update your resume with more relevant experience and skills."
                )