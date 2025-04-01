import { makeStyles } from "@mui/styles";

export default makeStyles(() => ({
    appBar: {
        borderRadius: 15,
        margin: '30px 0',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Keeps left & right aligned properly
        padding: '10px 20px',
    },
    
    image: {
        height: '60px',
        padding: '5px',
    },

    buttonContainer: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: 'auto',
    },

    box: {
        display: 'flex',
        alignItems: 'center',
    },

    // Responsive Design
    "@media (max-width: 600px)": {
        appBar: {
            flexDirection: 'row', // Keep elements in one row
            padding: '10px',
        },

        image: {
            height: '50px', // Reduce size on smaller screens
            marginLeft: '10px',
        },

        buttonContainer: {
            marginLeft: 'auto', // Ensures button stays on the right
        }
    }
}));
