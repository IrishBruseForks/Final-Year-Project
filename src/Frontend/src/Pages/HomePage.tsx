import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

function MyBoxes() {
  return (
    <Grid container spacing={3} style={{ height: '100vh', padding: '15px' }}>
      
      {/* Left Side */}
      <Grid item xs={12} sm={3}>
      <Box sx={{ backgroundColor: '#18191A', height: '30%', margin: '10px', borderRadius: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h5">Profile and Settings Box (login/logout - report bugs etc)</Typography>
        </Box>
        <Box sx={{ backgroundColor: '#18191A', height: '70%', margin: '10px', borderRadius: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h6">NAVIGATION: List of Chats, Friends, Notifications etc...</Typography>
        </Box> 
      </Grid>

      {/* Middle */}
      <Grid item xs={12} sm={6}>
      <Box sx={{ backgroundColor: '#18191A', height: '80%', margin: '10px', borderRadius: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h6">Before clicking on a chat will be a logo or a welcome back *name here*. Then it will display text and group info etc... </Typography>
        </Box>
        <Box sx={{ backgroundColor: '#18191A', height: '20%', margin: '10px', borderRadius: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h6">Keyboard or buttons for AI or other multimedia functions.</Typography>
        </Box>
      </Grid>

      {/* Right Side */}
      <Grid item xs={12} sm={3}>
      <Box sx={{ backgroundColor: '#18191A', height: '100%', margin: '10px', borderRadius: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h6">More features here.</Typography>
        </Box>
      </Grid>

    </Grid>
  );
}

export default MyBoxes;
