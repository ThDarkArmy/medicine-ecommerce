import { useState, useEffect } from "react";
import Header from "../components/Header";
import { Typography, Box, TextField } from '@mui/material';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProductCardHome from "../components/ProductCardHome";
import ImageSlider from "../components/ImageSlider";
import Img1 from "../images/img1.jpg";
import Img2 from "../images/img2.png";
import Img3 from "../images/img3.jpg";
import Img4 from "../images/img4.avif";
import Img5 from "../images/img5.jpg";


const BASE_URL = "http://localhost:8000/api/v1";

const Home = () => {
  const topImages = [Img1, Img2, Img3, Img4, Img5]
  const [products, setProducts] = useState([]);
  const [productsToDisplay, setProductsToDisplay] = useState([]);
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    loadProducts();
  }, [])

  const loadProducts = async () => {
    try{
      const response = await axios.get(`${BASE_URL}/products/approved`);
      if(response.data){
        setProducts(response.data);
        setProductsToDisplay(response.data);
      }
    }catch(error){
      console.log(error);
    }
  }

  useEffect(()=> {
    const productsToDisplay = products.filter(product=> product.name.toLowerCase().includes(searchText.toLowerCase()));
    console.log(productsToDisplay)
    setProductsToDisplay(productsToDisplay)
  },[searchText])
  return (
    <>
      <Header />
      <div style={{marginTop: 64}}>
      <ImageSlider topImages={topImages}/>
      </div>
      
      <div style={{ marginTop: 10, padding: 20 }}>
       
       <Box sx={{mt: 2, padding: 1}}>
          <TextField onChange={(e)=> setSearchText(e.target.value)} fullWidth placeholder="Search"/>
       </Box>
       {productsToDisplay && <Box container spacing={2} display="block">

          {[ ...new Set(productsToDisplay.map((p) => p.category))].map(
            (category) => (
              <Box key={category} display="block" sx={{mt: 6, padding: 1}}> 
              <Box sx={{padding: 1, bgcolor: "#fff"}}>
                <Typography variant="h6" gutterBottom sx={{fontWeight: 600}}>
                  {category}
                </Typography>
                </Box>
                <Box display="flex" sx={{overflowX: "auto", "-webkit-scrollbar": {display: "none"}, paddingBottom: 5, marginTop: 1}}>
                  {productsToDisplay
                    .filter((p) => (category === 'All' || p.category === category))
                    .map((product) => (
                      <div style={{marginRight: 20}}>
                        <ProductCardHome
                          product={product}
                        />
                      </div>
                    ))}
                </Box>
              </Box>
            )
          )}
        </Box>}
      </div>
    </>
  );
};

export default Home;
