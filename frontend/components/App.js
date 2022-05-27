import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axiosWithAuth from '../axios/index'
import axios from 'axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)
  

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => navigate('/')
  const redirectToArticles = () => navigate('/articles') 

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    if(localStorage.getItem('token')){
      localStorage.removeItem('token')
      setMessage('Goodbye!')
    }
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    redirectToLogin()
    // using the helper above.
  }

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    setMessage('')
    setSpinnerOn(true)   
    // and launch a request to the proper endpoint.
    axiosWithAuth().post(loginUrl, {username, password})
    // On success, we should set the token to local storage in a 'token' key,
    .then(res => {
      setMessage(res.data.message)
      window.localStorage.setItem('token', res.data.token)
    // put the server success message in its proper state, and redirect
      redirectToArticles()
      
      
      
    // to the Articles screen. Don't forget to turn off the spinner!
  })
    .catch(err => console.log(err))

}   

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    !currentArticleId ? setMessage("") : null
    setSpinnerOn(true)
    // and launch an authenticated request to the proper endpoint.
    axios.get(articlesUrl, {
      headers: {
        authorization: localStorage.getItem("token")
      }
    })
    // On success, we should set the articles in their proper state and
    .then(res => {
       setArticles(res.data.articles)
    // put the server success message in its proper state.
      setMessage(res.data.message)
      setSpinnerOn(false)

  })
    .catch(err => {
      console.log(err)
      redirectToLogin()
    })
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
  }

  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    setMessage("")
    setSpinnerOn(true)
    axios.post(articlesUrl, article, {
      headers: {
      authorization: localStorage.getItem("token")
    }})
    // to inspect the response from the server.
    .then(res => {
      console.log(res)
      setArticles([...articles, res.data.article])
      setMessage(res.data.message)
      setSpinnerOn(false)
    })
    .catch(err => {
      console.log(err)
      redirectToLogin()
    })
  }

  const updateArticle = ({ article_id, article }) => {
    // ✨ implemen
    // You got this!
    setSpinnerOn(true)
    axios.put(`${articlesUrl}/${article_id}`, article, {
      headers: {
        authorization: localStorage.getItem("token")
      }
    })
    .then(res => {
      console.log(res)
      setMessage(res.data.message)
      setCurrentArticleId()
      axios.get(articlesUrl, {
        headers: {
          authorization: localStorage.getItem("token")
        }
      })
      .then(res => {
        setArticles(res.data.articles)
        
      })
      setSpinnerOn(false)
    })
    .catch(err => console.log(err))
  }

  const deleteArticle = article_id => {
    // ✨ implement
    setSpinnerOn(true)
    axios.delete(`${articlesUrl}/${article_id}`, {
      headers: {
        authorization: localStorage.getItem("token")
      }
    })
      .then(res => {
        setMessage(res.data.message)
        axios.get(articlesUrl, {
          headers: {
            authorization: localStorage.getItem("token")
          }
        })
        .then(res => {
          setArticles(res.data.articles)
        })
        setSpinnerOn(false)
      })
      .catch(err => console.log(err))
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn}/>
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login}/>} />
          <Route path="articles" element={
            <>
              <ArticleForm 
              updateArticle={updateArticle} 
              postArticle={postArticle} 
              setCurrentArticleId={setCurrentArticleId} 
              currentArticleId={currentArticleId}
              articles={articles}
              />
              <Articles 
              deleteArticle={deleteArticle}
              setCurrentArticleId={setCurrentArticleId}
              articles={articles}
              currentArticleId={currentArticleId}
              getArticles={getArticles}
               />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
