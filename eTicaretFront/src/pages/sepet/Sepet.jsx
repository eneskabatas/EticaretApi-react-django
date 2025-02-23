import React, { useContext, useState } from 'react'
import Section from '../../components/section/Section'
import Footer from '../../components/footer/Footer'
import { GlobalContext } from '../../apiEndPoint/GlobalProvider'
import SepetCards from './SepetCards'
import "./sepet.css"
import { useEffect } from 'react'
import { getSepet } from '../../apiEndPoint/api'

const Sepet = () => {

  const { items, toplamFiyat, clearSepet,dispatch, tamamla, tamamlanmisSepetler } = useContext(GlobalContext)
  

  useEffect(()=> {
    getSepet().then((sepetResponse)=>{
      dispatch({
        type:"LOAD_SEPET",
        payload:{
            id:sepetResponse.id,
            items:sepetResponse.sepetUrunleri.map((urun)=>({
                id:urun.urun.id,
                name:urun.urun.name,
                fiyat:urun.urun.fiyat,
                image:urun.urun.image,
                amount:urun.adet,
                sepetUrunId: urun.id
            })),
            totalAmount:sepetResponse.sepetUrunleri.reduce(
                (acc,item) => acc + item.urun.fiyat * item.adet, 0
            )
        }
    })
    })
    
  },[])

 
  return (
    <>
      <Section>

        
        {
          items.length !== 0 ? <div>
            {
             items.map((urun,i) => (
                <div key={i}>
                  <SepetCards urun={urun}/>
                </div>
              ))
            }
            <div className='sepetTotalContainer'>
              <h2> toplam fiyat : {toplamFiyat} </h2>
              <button onClick={clearSepet}> sepeti temizle </button>
              <button onClick={tamamla} > Sepeti Tamamla </button>
            </div>
          </div>
            :
            <h1>sepette ürün yok</h1>
        }
        <br />
        <hr />
        <h1>Geçmiş Siparişler</h1>
        <br />

        {
          tamamlanmisSepetler !== 0 ?
          tamamlanmisSepetler.map((sepetler)=>(
            sepetler.sepetUrunleri.map((urunler,i)=>(
              <div key={i} >
                  <h2>urun adı: {urunler.urun.name}</h2>
              </div>
            ))
          ))
          :
          <h2>Geçmiş Siparişiniz Bulunmamakta.</h2>
        }

      </Section>
      <Footer />
    </>
  )
}

export default Sepet