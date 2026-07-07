import streamlit as st
from api import login, get_current_user

def show():
    st.title(" Login")

    email = st.text_input("Email")
    password = st.text_input("Password", type="password")

    if st.button("Login"):

        response = login(email, password)

        if response.status_code == 200:

            token = response.json()["access_token"]

            st.session_state.token = token

            user = get_current_user(token)

            if user.status_code == 200:

                st.session_state.user = user.json()

                st.rerun()

            else:
                st.error("Couldn't load user.")

        else:
            st.error("Invalid credentials.")