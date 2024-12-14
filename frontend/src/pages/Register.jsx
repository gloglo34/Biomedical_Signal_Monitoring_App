export default function Register() {
  return (
    <div className="wrapper">
      <form>
        <h1>Register</h1>
        <p>Please fill in this form to create an account.</p>

        <div className="input-box">
          <input
            type="text"
            placeholder="Enter email"
            name="email"
            id="email"
            required
          />
        </div>

        <div className="input-box">
          <input
            type="password"
            placeholder="Enter password"
            name="password"
            id="password"
            required
          />
        </div>

        <div className="input-box">
          <input
            type="password"
            placeholder="Confirm password"
            name="password-confirm"
            id="password-confirm"
            required
          />
        </div>

        <div className="register-link">
          <p>
            By creating an account you agree to our{" "}
            <a href="#">Terms & Privacy</a>
          </p>
        </div>

        <button type="submit" className="registerBtn">
          Register
        </button>

        <div className="register-link">
          <p>
            Already have an account? <a href="/">Log in</a>
          </p>
        </div>
      </form>
    </div>
  );
}
