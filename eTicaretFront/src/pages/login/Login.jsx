import './login.css'
import Section from '../../components/section/Section'
import { Link, Navigate } from 'react-router-dom'
import Footer from '../../components/footer/Footer'
import { useContext } from 'react'
import { GlobalContext } from '../../apiEndPoint/GlobalProvider'

const Login = () => {

  const {userName,setUserName,userPassword,setUserPassword,userLogin,validUser} = useContext(GlobalContext)

  const handleLogin = (e) => {
    e.preventDefault()

    const empty = str => !str.trim().length

    try{
      if(empty(userName) && empty(userPassword)){
        throw "kullanıcı bilgileri boş geçilemez"
      }
      userLogin(userName,userPassword)
    }catch(e){
      alert(e)
    }

  }

  if(validUser){
    return <Navigate to="/"/>
  }

  return (
    <>
        <Section>
            <div className='loginContainer'>
                <h1>Giriş Yap</h1>
                <form>
                    <input type="text" placeholder='Kullanıcı adı veya Email' value={userName} onChange={(e)=>setUserName(e.target.value)} />
                    <input type="password" placeholder='Şifreniz' value={userPassword} onChange={(e)=>setUserPassword(e.target.value)} />
                    <Link to={"/register"}> Üye Değil Misiniz? Hemen Üye Olmak için Tıklayın! </Link>
                    <button onClick={handleLogin} >Giriş Yap</button>
                </form>

            </div>
        </Section>
        <Footer/>
    </>
  )
}

export default Login