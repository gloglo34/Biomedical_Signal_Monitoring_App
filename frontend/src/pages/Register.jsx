export default function Register() {
  return (
    <form>
      <h1>Register</h1>
      <p>Please fill in this form to create an account.</p>

      <label for="email">
        <b>Email</b>
      </label>
      <input
        type="text"
        placeholder="Enter email"
        name="email"
        id="email"
        required
      />
      <label for="password">
        <b>Password</b>
      </label>
      <input
        type="password"
        placeholder="Enter password"
        name="password"
        id="password"
        required
      />
      <label for="password-confirm">
        <b>Confirm Password</b>
      </label>
      <input
        type="password"
        placeholder="Confirm password"
        name="password-confirm"
        id="password-confirm"
        required
      />
      <p>
        By creating an account you agree to our <a href="#">Terms & Privacy</a>
      </p>
      <button type="submit" className="registerBtn">
        Register
      </button>
      <p>
        Already have an account? <a href="/">Log in</a>
      </p>
    </form>
  );
}
