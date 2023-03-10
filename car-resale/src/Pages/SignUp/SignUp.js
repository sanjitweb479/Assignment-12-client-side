import { GoogleAuthProvider, updateCurrentUser } from "firebase/auth";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";
import useToken from "../../hooks/useToken";
// import useToken from "../../hooks/useToken";

const SignUp = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const { createUser, updateUser, providerLogin } = useContext(AuthContext);
  const googleProvider = new GoogleAuthProvider();
  const [signUpError, setSignUpError] = useState("");
  const [createdUserEmail, setCreatedUserEmail] = useState("");
  const [token] = useToken(createdUserEmail);
  const navigate = useNavigate();

  if (token) {
    navigate("/");
  }

  const handleSignUp = (data) => {
    console.log(data);
    setSignUpError("");
    createUser(data.email, data.password, data.role)
      .then((result) => {
        const user = result.user;
        console.log(user);
        toast("User Created Successfully");

        const userInfo = {
          displayName: data.name,
        };
        updateUser(userInfo).then(() => {
          saveUser(data.name, data.email, data.role);
          navigate("/");
        });
      })
      .catch((err) => {
        console.error(err);
        setSignUpError(err.message);
      });
  };

  const saveUser = (name, email, role) => {
    const user = { name, email, role };
    fetch(
      "https://b612-used-products-resale-server-side-sanjitweb479.vercel.app/users",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(user),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("save user", data);
        setCreatedUserEmail(email);
      });
  };

  // const getUserToken = (email) => {
  //   fetch(`https://b612-used-products-resale-server-side-sanjitweb479.vercel.app/jwt?email=${email}`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data.accessToken) {
  //         localStorage.setItem("accessToken", data.accessToken);
  //         navigate("/");
  //       }
  //     });
  // };

  const handleGoogleSignIn = () => {
    providerLogin(googleProvider)
      .then((result) => {
        const user = result.user;
        console.log(user);
        toast("User Created Successfully");

        const userInfo = {
          displayName: user.displayName,
        };
        updateUser(userInfo).then(() => {
          saveUser(userInfo.displayName, user.email, (user.role = "buyers"));
          navigate("/");
        });
      })
      .catch((err) => {
        console.error(err);
        setSignUpError(err.message);
      });
  };

  return (
    <div className="h-[800px] flex justify-center items-center">
      <div className="w-96 p-7">
        <h2 className="text-xl text-center">Sign Up</h2>
        <form onSubmit={handleSubmit(handleSignUp)}>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="name"
              {...register("name", {
                required: "Name is required",
              })}
              className="input input-bordered w-full max-w-xs"
            />
            {errors.name && (
              <p className="text-red-600" role="alert">
                {errors.name?.message}
              </p>
            )}
          </div>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email Address is required",
              })}
              className="input input-bordered w-full max-w-xs"
            />
            {errors.email && (
              <p className="text-red-600" role="alert">
                {errors.email?.message}
              </p>
            )}
          </div>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              {...register("password", {
                required: "Password is Required",
                minLength: {
                  value: 6,
                  message: "Password Must be 6 characters or longer",
                },
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&^_-]{8,}$/,
                  message: "Password Must be Strong",
                },
              })}
              className="input input-bordered w-full max-w-xs"
            />
            {errors.password && (
              <p className="text-red-600" role="alert">
                {errors.password?.message}
              </p>
            )}
            <br />
          </div>
          <div className="form-control w-full max-w-xs shadow bg-base-100 rounded-box mb-4">
            <label className="label">
              <span className="label-text">Role</span>
            </label>
            <select {...register("role")}>
              <option value="user">user</option>
              <option value="seller">seller</option>
            </select>
          </div>
          <input
            className="btn btn-accent w-full"
            value="signUp"
            type="submit"
          />
        </form>
        {signUpError && <p className="text-red-600"> {signUpError}</p>}
        <br />
        <p>
          Already Have an Account{"    "}
          <Link className="text-secondary" to="/login">
            Please Login
          </Link>
        </p>
        <div className="divider">OR</div>

        <button onClick={handleGoogleSignIn} className="btn btn-outline w-full">
          <Link to="/login">CONTINUE WITH GOOGLE</Link>
        </button>
      </div>
    </div>
  );
};

export default SignUp;
