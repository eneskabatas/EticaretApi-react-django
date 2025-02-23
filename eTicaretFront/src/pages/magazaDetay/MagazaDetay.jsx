import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { GlobalContext } from '../../apiEndPoint/GlobalProvider'
import Section from '../../components/section/Section'
import Footer from '../../components/footer/Footer'

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import UrunGuncelleModal from './UrunGuncelleModal'

const MagazaDetay = () => {

    const { id } = useParams()
    const { magazaDetay, magazaDetaylari, bedenler, urunRenkleri, kategoriler, urunBilgileri, setUrunBilgileri, magazaUrunEkle, magazaUrunleri, getBeden, getRenkler,magazaUrunuGuncelle, magazaUrunSil } = useContext(GlobalContext)

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    

    useEffect(() => {
        magazaDetay(id)
        setUrunBilgileri({ ...urunBilgileri, magza: Number(id) })
    }, [id])


    const handleClick = (e) => {
        e.preventDefault()
        const urunDatasi = new FormData();

        urunDatasi.append("name", urunBilgileri.name)
        urunDatasi.append("aciklama", urunBilgileri.aciklama)
        urunDatasi.append("fiyat", urunBilgileri.fiyat)
        urunDatasi.append("stok", urunBilgileri.stok)
        urunDatasi.append("image", urunBilgileri.image)
        urunDatasi.append("category", urunBilgileri.category)
        urunDatasi.append("magza", urunBilgileri.magza)

        urunBilgileri.ebat.map((beden) => urunDatasi.append("ebat", beden))
        urunBilgileri.renk.map((renk) => urunDatasi.append("renk", renk))

        magazaUrunEkle(urunDatasi)
    }

    const handleGüncelle = (seciliUrun) => {

        const formData = new FormData()

        formData.append("name", seciliUrun.name)
        formData.append("aciklama", seciliUrun.aciklama)
        formData.append("fiyat", seciliUrun.fiyat)
        formData.append("stok", seciliUrun.stok)
        formData.append("image", seciliUrun.image)
        formData.append("category", seciliUrun.category)
        formData.append("magza", seciliUrun.magza)

        seciliUrun.ebat.map((beden) => formData.append("ebat", beden))
        seciliUrun.renk.map((renk) => formData.append("renk", renk))

        magazaUrunuGuncelle(seciliUrun.id,formData)
    }




    return (
        <>
            <Section>
                <div>
                    <h1>{magazaDetaylari.mAdi}</h1>
                    <h2> {magazaDetaylari.mEmail} </h2>
                </div>

                <div>
                    <h1>ürün ekle</h1>
                    <form>
                        <label> magzanın adı </label>
                        <input type="text" disabled placeholder={magazaDetaylari.mAdi} /> <br />

                        <label> ürün adı </label>
                        <input type="text" onChange={(e) => setUrunBilgileri({ ...urunBilgileri, name: e.target.value })} /> <br />

                        <label> ürün acıklama </label>
                        <input type="text" onChange={(e) => setUrunBilgileri({ ...urunBilgileri, aciklama: e.target.value })} /> <br />

                        <label> ürün fiyat </label>
                        <input type="text" onChange={(e) => setUrunBilgileri({ ...urunBilgileri, fiyat: e.target.value })} /> <br />

                        <label> ürün stok </label>
                        <input type="text" onChange={(e) => setUrunBilgileri({ ...urunBilgileri, stok: e.target.value })} /> <br />

                        <label> ürün resim </label>
                        <input type="file" accept='image/*' onChange={(e) => setUrunBilgileri({ ...urunBilgileri, image: e.target.files[0] })} /> <br />

                        <label> ürün kategori </label>
                        <select onChange={(e) => setUrunBilgileri({ ...urunBilgileri, category: e.target.value })} >
                            <option value=""> Kategori Seç </option>
                            {
                                kategoriler.map((kategori) => (
                                    <option key={kategori.id} value={kategori.id} > {kategori.name} </option>
                                ))
                            }
                        </select>
                        <br />

                        <label> ürün ebat </label>
                        <select multiple onChange={(e) => setUrunBilgileri({ ...urunBilgileri, ebat: [...e.target.selectedOptions].map((id) => id.value) })}>
                            {
                                bedenler.map((beden) => (
                                    <option key={beden.id} value={beden.id}> {beden.name} </option>
                                ))
                            }
                        </select>
                        <br />

                        <label> ürün renk </label>
                        <select multiple onChange={(e) => setUrunBilgileri({ ...urunBilgileri, renk: [...e.target.selectedOptions].map((id) => id.value) })} >
                            {
                                urunRenkleri.map((renk) => (
                                    <option key={renk.id} value={renk.id} > {renk.name} </option>
                                ))
                            }
                        </select>
                        <br />
                        <button onClick={handleClick} >Gönder</button>
                    </form>
                </div>

                <br /><hr /><br />

                {
                    magazaUrunleri.map((urun) => (
                        <div key={urun.id} >
                            <div> {urun.name} </div>
                            <div> {urun.aciklama} </div>
                            <div> {urun.fiyat} </div>
                            <div> {urun.stok} </div>
                            <div> {urun.renk.map(id => getRenkler(id))} </div>
                            <div> ebat {urun.ebat.map(id => getBeden(id))} </div>
                            <div> {urun.kategori} </div>
                            <Button variant="primary" onClick={handleShow}>
                                Güncelle
                            </Button>
                            <Button variant="primary" onClick={()=>magazaUrunSil(urun.id)}>
                                Urunu Sıl
                            </Button>

                            <UrunGuncelleModal urun={urun} show={show} handleGüncelle={handleGüncelle} handleClose={handleClose}  urunBilgileri={urunBilgileri} />


                            

                        </div>
                    ))
                }

            </Section>
            <Footer />
        </>
    )
}

export default MagazaDetay