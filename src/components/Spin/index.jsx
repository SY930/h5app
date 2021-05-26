import React from "react";
import styles from './style.less'
// import { makeStyles } from '@material-ui/core/styles';
// const load = keyframes`
// 0%{
//     -webkit-transform: scale(1.2),
//     opacity: 1,
// }
// 100%{
//     -webkit-transform: scale(.3),
//     opacity: 0.5,
// }
// `

// const useStyles = makeStyles({
//     loadEffect: {
//         width: '100px',
//         height: '100px',
//         position: 'relative',
//         margin: '0 auto',
//         marginTop: '100px',
        
//     },
//     dot: {
//         display: 'inline-block',
//         width: '20px',
//         height: '20px',
//         borderRadius: '50%',
//         background: 'lightgreen',
//         position: 'absolute',
//         '-webkit-animation':  `load 1.04s ease infinite`,
//         '& span:nth-child(1)': {
//             left: 0,
//             top: '50%',
//             marginTop: '-10px',
//             '-webkit-animation-delay': '0.13s',
//         },
//         '& span:nth-child(2)': {
//             left: '14px',
//             top: '14px',
//             '-webkit-animation-delay': '0.26s',
//         },
//         '& span:nth-child(3)': {
//             left: '50%',
//             top: 0,
//             marginLeft: '-10px',
//             '-webkit-animation-delay': '0.39s',
//         },
//         '& span:nth-child(4)': {
//             top: '14px',
//             right: '14px',
//             '-webkit-animation-delay': '0.52s',
//         },
//         '& span:nth-child(5)': {
//             top: '50%',
//             right: 0,
//             marginLeft: '-10px',
//             '-webkit-animation-delay': '0.65s',
//         },
//         '& span:nth-child(6)': {
//             bottom: '14px',
//             right: '14px',
//             '-webkit-animation-delay': '0.78s',
//         },
//         '& span:nth-child(7)': {
//             bottom: 0,
//             left: '50%',
//             marginLeft: '-10px',
//             '-webkit-animation-delay': '0.91s',
//         },
//         '& span:nth-child(8)': {
//             bottom: '14px',
//             left: '14px',
//             '-webkit-animation-delay': '1.04s',
//         },
//     },
//    '@-webkit-keyframes load': {
//         '0%': {
//             opacity: 1,
//         },
//         '100%': {
//             opacity: 0.2,
//         }
//     }
//   });
export default function Spin() {
    // const classes = useStyles();
    return (
        <div className={styles.loadingBox}>
        <div className={styles.loading}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        </div>
        </div>
    )
}