import React, { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { GlobalContext } from '../../apiEndPoint/GlobalProvider'
import Section from "../../components/section/Section"
import Footer from "../../components/footer/Footer"

const Detay = () => {

    const { id } = useParams()
    const { urunDetay, detayUrun, getBeden, getRenkler, secilenRenk, setSecilenRenk, secilenBeden, setSecilenBeden, addUrun, urunYorumlari, kullaniciYorumu, setKullaniciYorumu, userYorumuGönder, satinAlmis, yorumYapabilir, urunPuani,kullaniciPuani,setKullaniciPuani,userPuanGonder } = useContext(GlobalContext)

    useEffect(() => {
        urunDetay(id)
        satinAlmis(id)
        // console.log("detayyyyyy",yorumYapabilir)
    }, [id])



    const bedenSecenekleri = detayUrun.ebat && detayUrun.ebat.map((bedenId) => <option key={bedenId} value={bedenId} > {getBeden(bedenId)} </option>)

    const renkSecenekleri = detayUrun.renk && detayUrun.renk.map((renkId) => <option key={renkId} value={renkId} > {getRenkler(renkId)} </option>)



    return (
        <>
            <Section>
                <h1> {detayUrun.name} </h1>
                <h2> ürünün Puanı : {urunPuani} </h2>

                <select onChange={(e) => setSecilenBeden(e.target.value)} value={secilenBeden} >
                    <option value="">beden seçin</option>
                    {bedenSecenekleri}
                </select>

                <select onChange={(e) => setSecilenRenk(e.target.value)} value={secilenRenk} >
                    <option value=""> renk seçin </option>
                    {renkSecenekleri}
                </select>
                <div>
                    <button onClick={() => addUrun(detayUrun)} > Sepete Ekle </button>
                </div>

                <br /><hr />
                <br />



                <h1>Yapılan Yorumlar</h1>
                {
                    urunYorumlari.map((yorumlar, i) => (
                        <div key={i}>
                            <h2>yorumu yapan : {yorumlar.owner_username} </h2>
                            <h3> yorumu: {yorumlar.uYorum} </h3>
                        </div>
                    ))
                }


                <br /><hr /><br />

                {
                    yorumYapabilir ?
                        <div>
                            <h1>Yorum Gönder</h1>
                            <textarea style={{ resize: "none" }} value={kullaniciYorumu} onChange={(e) => setKullaniciYorumu(e.target.value)} ></textarea>
                            <button onClick={() => userYorumuGönder(detayUrun.id)}>Yorum Gönder</button>
                            <div>
                                <input type="number" min="1" max="5" value={kullaniciPuani} onChange={(e)=> setKullaniciPuani(e.target.value)} />
                                <button onClick={()=>userPuanGonder(detayUrun.id)} >Puan Gönder</button>
                            </div>
                        </div>
                        :
                        <h1> yorum yapmaya yetkiniz yok </h1>
                }

            </Section>
            <Footer />
        </>
    )
}

export default Detay