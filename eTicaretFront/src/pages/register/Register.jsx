import './register.css'
import Section from '../../components/section/Section'
import Footer from '../../components/footer/Footer'
import { useContext } from 'react'
import { GlobalContext } from '../../apiEndPoint/GlobalProvider'

const Register = () => {

  const { userName,setUserName,userEmail,setUserEmail,userPassword,setUserPassword,userPasswordTekrar,setUserPasswordTekrar, userRegister } = useContext(GlobalContext)

  const handleRegister = (e) => {
    e.preventDefault()

    // empty gönderilen verinin trimini alır ve boş olup olmadığını kontrol eder
    const empty = str => !str.trim().length

    try{
      if(userPassword !== userPasswordTekrar){
        throw "Parolalar Eşit değil"
      }
      if(empty(userName)){
        throw "Username Boş Geçilemez"
      }
      if(empty(userEmail)){
        throw "Email alanı boş geçilemez"
      }
      if(empty(userPassword && userPasswordTekrar)){
        throw "parola alanı boş geçilemez"
      }
      // eger iflere girmezse normal şekilde kayıt fonksiyonunu çalıştır
      userRegister(userName,userEmail,userPassword)
    }catch(error){
      alert(error)
    }
  }
  
  return (
    <>
        <Section>
            <div className='registerContainer'>
                <h1>Kayıt Ol</h1>
                <form>
                    <input type="text" placeholder='Kullanıcı Adı' value={userName} onChange={(e)=>setUserName(e.target.value)} />
                    <input type="email" placeholder='Email Adresinizi Girin' value={userEmail} onChange={(e)=>setUserEmail(e.target.value)} />
                    <input type="password" placeholder='Şifre Girin' value={userPassword} onChange={(e)=>setUserPassword(e.target.value)} />
                    <input type="password" placeholder='Şifrenizi Tekrar Girin' value={userPasswordTekrar} onChange={(e)=>setUserPasswordTekrar(e.target.value)} />
                    <button onClick={handleRegister} >Kayıt Ol</button>
                </form>
            </div>
        </Section>
        <Footer/>
    </>
  )
}

export default Register