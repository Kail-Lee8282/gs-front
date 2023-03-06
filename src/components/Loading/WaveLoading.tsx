import { motion } from "framer-motion";
import styled from "styled-components";

const LoadingWrapper = styled(motion.div)`
display: flex;
gap:2px;
justify-content: center;
align-items: center;
position: relative;
top:-5px;
padding:5px;
`;

const LoadingCircle = styled(motion.span)`
width: 10px;
height:10px;
background-color: black;
border-radius: 50%;
`




function WaveLoading() {

    const loadingContainerVariants = {
        start: {
            transition: {
                staggerChildren: 0.2,
            },
        },
        end: {
            transition: {
                staggerChildren: 0.2,
            },
        },
    }
    const loadingCircleVariants = {
        start: {
            y: "0%",
        },
        end: {
            y: "100%",
        },
    }
    const loadingCircleTransition = {
        duration: 0.5,
        yoyo: Infinity,
        ease: "easeInOut",
    }
    return (
        <LoadingWrapper
            variants={loadingContainerVariants}
            initial="start"
            animate="end"
        >
            <LoadingCircle
                variants={loadingCircleVariants}
                transition={loadingCircleTransition}
            />
            <LoadingCircle
                variants={loadingCircleVariants}
                transition={loadingCircleTransition}
            />
            <LoadingCircle
                variants={loadingCircleVariants}
                transition={loadingCircleTransition}
            />
        </LoadingWrapper>
    )
}

export default WaveLoading;