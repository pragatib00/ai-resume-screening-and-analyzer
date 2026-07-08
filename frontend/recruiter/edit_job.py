import streamlit as st
from api import update_job


def show():

    st.title("Edit Job")

    if "editing_job" not in st.session_state:

        st.warning("No job selected to edit.")
        return

    job = st.session_state.editing_job

    token = st.session_state.token

    if st.button("← Back to My Jobs"):

        del st.session_state.editing_job

        st.session_state.page = "My Jobs"

        st.rerun()

    with st.form("edit_job_form"):

        title = st.text_input(
            "Job Title",
            value=job["title"]
        )

        company = st.text_input(
            "Company",
            value=job["company"]
        )

        location = st.text_input(
            "Location",
            value=job["location"]
        )

        required_skills = st.text_area(
            "Required Skills",
            value=job["required_skills"]
        )

        description = st.text_area(
            "Job Description",
            value=job["description"]
        )

        submit = st.form_submit_button("Save Changes")

    if submit:

        if (
            title == ""
            or company == ""
            or location == ""
            or required_skills == ""
            or description == ""
        ):

            st.warning("Please fill all fields.")

            return

        updated_job = {

            "title": title,

            "company": company,

            "location": location,

            "required_skills": required_skills,

            "description": description

        }

        response = update_job(
            job["id"],
            token,
            updated_job
        )

        if response.status_code == 200:

            st.success("Job updated successfully!")

            del st.session_state.editing_job

            st.session_state.page = "My Jobs"

            st.rerun()

        else:

            try:
                st.error(response.json()["detail"])
            except:
                st.error("Unable to update job.")