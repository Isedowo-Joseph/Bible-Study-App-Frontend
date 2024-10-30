import React from 'react';
import styled from "@emotion/styled";
import {
    Card,
    CardHeader,
    IconButton,
    Typography,
  } from '@mui/material';
  import { FaFacebookF, FaTwitter } from 'react-icons/fa';
import { AiOutlineInstagram } from 'react-icons/ai';
const randomImage =
    'https://source.unsplash.com/1600x900/?nature,photography,technology';
const ProgressContainer = styled.div({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
});
const BallStyleProfile = styled.div({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '',
    borderRadius: 90,
    width: 135,
    height: 135,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    marginTop: 119,
    marginLeft: 90,
});
const Container = styled.div({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
});
//image will be assigned to backgrounImage
const BackgroundImgContainer = styled.div({
    display: 'flex',
    position: 'relative',
    top: "61px",
    height: 208,
    width: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    // backgroundImage: `url(${randomImage})`,
    backgroundColor: "red"
});
const Text1 = styled(Typography)({
    position: 'relative',
    fontSize: '23px',
    lineHeight: '18px',
    fontWeight: 600,
    color: '#000000',
    marginTop: 220,
    marginLeft: 10,
});
const SocialDiv = styled.div({
    marginTop: "59px",
});

const BodyContainer = styled.div({
    display: 'flex',
    height: '100%',
    width: '77%',
    flexDirection: 'column',
    textAlign: 'right',
});

const ParentCardContainer = styled.div({
    display: 'flex',
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    textAlign: 'center',
    marginBottom: 200,
});
const CardContainer = styled.div({
    display: 'flex',
    flexWrap: 'wrap',
    flexdirection: 'column',
    justifyContent: 'center',
    width: '50%',
    marginTop: 30,
    gap: 20,
});
const StyledFacebook = styled(FaFacebookF)({
    minWidth: 30,
    height: 30,
    marginTop: 2,
    marginLeft: 5,
    color: 'rgb(24, 119, 242)',
});
const StyledTwitter = styled(FaTwitter)({
    minWidth: 30,
    height: 30,
    marginTop: 2,
    marginLeft: 10,
    color: 'rgb(28, 183, 235)',
});
const StyledInstagram = styled(AiOutlineInstagram)({
    minWidth: 30,
    height: 30,
    marginTop: 2,
    marginLeft: 5,
});

const CardStyle = styled(Card)({
    width: '90%',
    borderColor: 'divider',
    height: 'fit-content',
});
const SeeAllLink = styled(Typography)({
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '18px',
    color: '#000000',
    marginTop: -25,
    textAlign: 'right',
});
const UserDetails = ({ user, toggleEdit }) => {
  return (
    <Container>
    <BackgroundImgContainer>
        <BallStyleProfile
            style={{
                backgroundImage: `url(${randomImage})`,
                backgroundColor: "grey",
            }}
        />
        <Text1>{user.userName}</Text1>
    </BackgroundImgContainer>
    <BodyContainer>
        <SocialDiv>
            <IconButton>
                <StyledInstagram />
            </IconButton>
            <IconButton>
                <StyledFacebook />
            </IconButton>
            <IconButton>
                <StyledTwitter />
            </IconButton>
        </SocialDiv>
    </BodyContainer>
</Container>
  );
};

export default UserDetails;
