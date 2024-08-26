import { useState, useRef, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle, faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import axios from "./api/axios";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
// const REGISTER_URL = '/register'

const Register = () => {
  const userRef = useRef()
  const errRef = useRef()

  const [user, setUser] = useState('')
  const [validName, setValidName] = useState(false)
  const [userFocus, setUSerFocus] = useState(false)

  const [pwd, setPwd] = useState('')
  const [validPwd, setValidPwd] = useState(false)
  const [Pwdfocus, setPwdFocus] = useState(false)
  
  const [matchPwd, setMatchPwd] = useState('')
  const [validMatch, setValidMatch] = useState(false)
  const [matchFocus, setMatchFocus] = useState(false)

  const [errMsg, setErrMsg] =  useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    userRef.current.focus()
  }, [])

  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user])

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd])

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd, matchPwd])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v1 = USER_REGEX.test(user)
    const v2 = PWD_REGEX.test(pwd)
    if(!v1 || !v2) {
      setErrMsg("invalid entry")
      return
    }
    try{
      const response = await axios.post(REGISTER_URL,
      JSON.stringify({user, pwd}),
      {
      header: {'Content-Type': 'application/json'},
      withCredentials: true
      })
      console.log(response.body)
      console.log(JSON.stringify(response))
      setSuccess(true)
    } catch (err) {
      if(!err?.response){
        setErrMsg('No server reponse')
      } else if(err.response?.status === 409) {
        setErrMsg("username taken")
      } else {
        setErrMsg("registration failed")
      }
      errRef.current.focus();
    }
  }
  
  return (
    <>
      {success ? (
        <section>
          <h1>success!</h1>
          <p>
            <a href="#">Sign in</a>
          </p>
        </section>
      ) : (
    <section>
      <p ref={errRef} className={errMsg ? "errMsg": "offscreen"} aria-live="assertive">{errMsg}</p>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:
              <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
              <FontAwesomeIcon icon={faTimes} className={validName || !user ? "hide" : "invalid"} />
        </label>
        <input
          type="text"
          id="username"
          ref={userRef}
          autoComplete="off"
          onChange={(e) => setUser(e.target.value)}
          required
          aria-invalid={validName ? "true" : "false"}
          aria-describedby="uidnote"
          onFocus={() => setUSerFocus(true)}
          onBlur={() => setUSerFocus(false)}
        />
        <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>          <FontAwesomeIcon icon={faInfoCircle}/>
          4 to 24 charachters <br/>
          Must begin with a letter <br/>
          Letter, Numbers, underscores and hyphens allowed.
        </p>
        <label htmlFor="password">Password:
          <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"}/>
          <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"}/>
        </label>
        <input
          type="password"
          id="password"
          onChange={(e) => setPwd(e.target.value)}
          required
          aria-invalid={validPwd ? "true" : "false"}
          aria-describedby="pwdnote"
          onFocus={() => setPwdFocus(true)}
          onBlur={() => setPwdFocus(false)}
        />
        <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
          <FontAwesomeIcon icon={faInfoCircle}/>
          8 to 24 charachters <br/>
          Must include uppercase, lowercase letters, a number and a special charachter. <br/>
          allowed special charachters <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
        </p>
        <label htmlFor="confirm_pwd">Confirm Password:
          <span className={validMatch && matchPwd ? "valid" : "hide"}>
            <FontAwesomeIcon icon={faCheck}/>
          </span>
          <span className={validPwd || !matchPwd ? "hide" : "invalid"}>
            <FontAwesomeIcon icon={faTimes}/>
          </span>
        </label>
        <input
          type="password"
          id="confirm_pwd"
          onChange={(e) => setMatchPwd(e.target.value)}
          required
          aria-invalid={validMatch ? "true" : "false"}
          aria-describedby="confirmnote"
          onFocus={() => setMatchFocus(true)}
          onBlur={() => setMatchFocus(false)}
        />
        <p id="confirmnote" className={matchFocus && user && !validMatch ? "instructions" : "offscreen"}>
          <FontAwesomeIcon icon={faInfoCircle}/>
        Must match the the password input field.
        </p>
      <button disabled={!validName || !validPwd || !validMatch ? true : false}>Sign Up</button>
      <p>
        Already Register?<br/>
        <span className="line">
          <a href="#">Sign in</a>
        </span>
      </p>
      </form>
    </section>
  )}
</>
)
}

export default Register
