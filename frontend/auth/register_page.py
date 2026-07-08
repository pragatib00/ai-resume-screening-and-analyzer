import streamlit as st
from api import register

def show():

    st.header(" Create Account")

    if st.session_state.get("just_registered"):

        st.success(" Account created successfully!")

        st.info("You can now login.")

        if st.button(" Go to Login", use_container_width=True):

            st.session_state.just_registered = False

            st.session_state.page = "Login"

            st.rerun()

        return

    name = st.text_input("Full Name")

    email = st.text_input("Email")

    password = st.text_input(
        "Password",
        type="password"
    )

    role = st.selectbox(
        "Register As",
        [
            "candidate",
            "recruiter",
            "admin"
        ]
    )

    admin_secret = None

    if role == "admin":
        admin_secret = st.text_input(
            "Admin Secret Key",
            type="password",
            help="Required to register as an admin. Contact your system administrator if you don't have this."
        )

    if st.button("Create Account", use_container_width=True):

        if not name or not email or not password:
            st.warning("Please fill all the fields.")
            return

        if role == "admin" and not admin_secret:
            st.warning("Please enter the admin secret key.")
            return

        response = register(
            name=name,
            email=email,
            password=password,
            role=role,
            admin_secret=admin_secret
        )

        if response.status_code == 200:

            st.session_state.just_registered = True

            st.rerun()

        else:

            try:
                detail = response.json()["detail"]
            except:
                detail = "Registration failed."

            st.error(detail)