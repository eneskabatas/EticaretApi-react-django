import { useContext } from "react"
import "./homepage.css"
import Footer from "../../components/footer/Footer"
import Section from "../../components/section/Section"
import UrunCards from "./UrunCards"
import { GlobalContext } from "../../apiEndPoint/GlobalProvider"


const Homepage = () => {

  const { urunler } = useContext(GlobalContext)

  

  return (
    <>
      <Section>
        <div className="urunCardWrapper">
          {
            urunler.map((urun) => (
              <UrunCards urun={urun} key={urun.id} />
            ))
          }
        </div>
      </Section>
      <Footer />
    </>
  )
}

export default Homepage