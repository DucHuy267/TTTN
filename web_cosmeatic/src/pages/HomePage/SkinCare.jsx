
import React from "react";
import styled from "styled-components";
import { FaLeaf, FaRecycle } from "react-icons/fa";

const SkinCareContainer = styled.div`
  font-family: Arial, sans-serif;
  background-color: #f9f9f0;
  padding: 40px;
  text-align: center;
`;

const HeroSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const ImageWrapper = styled.div`

  img {
    max-width: 100%;
    border-radius: 10px;
  }
`;

const TextWrapper = styled.div`
  flex: 1;

  h1 {
    font-size: 2.5rem;
    color: #2e7d32;
    margin-bottom: 20px;
  }

  p {
    font-size: 1rem;
    color: #555;
    margin-bottom: 20px;
  }

  button {
    background-color: #2e7d32;
    color: #fff;
    padding: 10px 20px;
    width: 350px;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #1b5e20;
    }
  }
`;

const FeaturesSection = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const FeatureBox = styled.div`
  text-align: center;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  max-width: 200px;

  svg {
    font-size: 2rem;
    color: #2e7d32;
    margin-bottom: 10px;
  }

  h3 {
    font-size: 1.2rem;
    margin-bottom: 10px;
  }

  p {
    font-size: 0.9rem;
    color: #555;
  }
`;

const SkinCare = () => {
  return (
    <SkinCareContainer>
      <HeroSection>
        <ImageWrapper>
          <img
          style={{marginLeft:60}}
            src="https://s3-alpha-sig.figma.com/img/5cc8/c22a/854da1584516d6ea9a6e41ec6ab14e3d?Expires=1737331200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=c1pqGJZJHr6j13WAfKH-Md2HbYbvwM-ivphwIM22oWFDsEGdVuvRsUk7y0QGrFHAatoKsBWpSt-7kR1AXf5gszDsfY3Xasuxgh09yv5pzjdrKuVlzHc8z2iZdwkpEoIksIaOHEbeuj5CnaWMO7vMngPP8ooxAorDFG~aW7sImAP7ORmbkU4oRSRXqfzVpmsohO4fq4kxzelIcF5vQEYTfOQl~uXnzEJE5CGg9g2WeQOqPUaCLbWhb~hL1rrMXSRx4gZLTmeaxIWU7Y6nL9f-DO2QcTs8rvWZ~EwuBrTQWE7Nw~TY~nFcNpkDLQZLFeVt1DdiMc4I5FHVg~xrG3lU1Q__"
            alt="Healthy and glowing skin"
          />
        </ImageWrapper>
        <TextWrapper style={{ marginRight: 200, marginLeft: 50 }}>
          <h1 style={{ fontSize: 80 , }}>The Secret to Healthy and Glowing Skin</h1>
          <p>Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut.</p>
          <button>Learn more →</button>
        </TextWrapper>
      </HeroSection>

      <FeaturesSection>
        <FeatureBox>
          <FaRecycle />
          <h3>Eco Packaging</h3>
          <p>Lorem ipsum dolor sit amet</p>
        </FeatureBox>
        <FeatureBox>
          <FaLeaf />
          <h3>Eco Packaging</h3>
          <p>Lorem ipsum dolor sit amet</p>
        </FeatureBox>
        <FeatureBox>
          <FaRecycle />
          <h3>Eco Packaging</h3>
          <p>Lorem ipsum dolor sit amet</p>
        </FeatureBox>
      </FeaturesSection>
    </SkinCareContainer>
  );
};

export default SkinCare;
