import './urunCards.css'
import {useContext, useEffect, useState} from "react"
import {GlobalContext} from "../../apiEndPoint/GlobalProvider"
import { Link } from 'react-router-dom'
import { favoriList } from '../../apiEndPoint/api'


const UrunCards = ({urun}) => {

    const {image,name,fiyat, id} = urun
    const{favoriEkle,favorilerim} = useContext(GlobalContext)
    
    const [favoriMi,setFavoriMi]= useState(false)


   
    
    useEffect(()=>{
        const favoriUrunId = favorilerim.map((urun)=> {return urun.urun} )
        if(favoriUrunId.includes(id)){
            setFavoriMi(true)
        }else{
            setFavoriMi(false)
        }
    },[favorilerim])


  return (
    <>
        <div className='urunCardContainer'>

            <figure>
                <img src={image} alt="" />
            </figure>

            <div className='urunDetail'>
                <span>{name}</span>
                <span>{fiyat}</span>
            </div>

            <div className='urunBtnContainer'>
                <button onClick={()=>favoriEkle(id)} > { favoriMi ? "fovoriden çıkar" : "favoriye ekle" } </button>
                <Link to={`/detay/${id}`} ><button >Detaya Git</button></Link>
            </div>
            
        </div>
    </>
  )
}

export default UrunCards