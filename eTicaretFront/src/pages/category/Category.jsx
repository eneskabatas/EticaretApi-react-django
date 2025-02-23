import React, { useContext, useEffect } from 'react'
import { GlobalContext } from '../../apiEndPoint/GlobalProvider'
import { useParams } from 'react-router-dom'
import Section from '../../components/section/Section'
import UrunCards from '../homepage/UrunCards'
import Footer from '../../components/footer/Footer'

const Category = () => {


    const { getKategori, kategoriDetay } = useContext(GlobalContext)
    const { slug } = useParams()

    useEffect(() => {
        getKategori(slug)
    }, [slug])


    return (
        <>
            <Section>
                <div className='urunCardWrapper'>
                    {
                        kategoriDetay.map((urun) => (
                            <UrunCards key={urun.id} urun={urun} />
                        ))
                    }
                </div>
            </Section>
            <Footer />
        </>

    )
}

export default Category