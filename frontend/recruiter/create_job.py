import streamlit as st
from api import create_job


def show():

    st.title("Create New Job")

    token = st.session_state.token

    with st.form("create_job_form"):

        title = st.text_input("Job Title")

        company = st.text_input("Company")

        location = st.text_input("Location")

        required_skills = st.text_area(
            "Required Skills",
            placeholder="Python, SQL, FastAPI..."
        )

        description = st.text_area(
            "Job Description"
        )

        submit = st.form_submit_button("Create Job")

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

        job = {

            "title": title,

            "company": company,

            "location": location,

            "required_skills": required_skills,

            "description": description

        }

        response = create_job(
            token,
            job
        )

        if response.status_code == 200:

            st.success("Job created successfully!")

        else:

            try:
                st.error(response.json()["detail"])
            except:
                st.error("Unable to create job.")