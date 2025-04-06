import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Chip,
  Paper,
  Divider,
  Link as MuiLink,
  Tab,
  Tabs,
  Stack,
  Card,
  CardContent,
  IconButton,
  Rating,
  Snackbar,
  Alert
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LinkIcon from '@mui/icons-material/Link';
import ArticleIcon from '@mui/icons-material/Article';
import GitHubIcon from '@mui/icons-material/GitHub';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useComparison } from '../contexts/ComparisonContext';
import ReviewsSection from '../components/ReviewsSection';
import AIModelBlog from '../components/AIModelBlog';
import { getModelById } from '../data/models';

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`model-tabpanel-${index}`}
      aria-labelledby={`model-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ModelDetailsPage = () => {
  const { id } = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [liked, setLiked] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [modelDetails, setModelDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get comparison context
  const { addModelToComparison, removeModelFromComparison, isModelInComparison } = useComparison();
  
  // Check if model is in comparison
  const inComparison = modelDetails ? isModelInComparison(parseInt(id)) : false;
  
  // Load the model based on ID
  useEffect(() => {
    // Simulate loading from API
    setLoading(true);
    // Get model data
    const modelData = getModelById(parseInt(id));
    
    if (modelData) {
      setModelDetails(modelData);
      document.title = `${modelData.name} | TrendMind`;
    } else {
      // Handle case where model is not found
      console.error(`Model with ID ${id} not found`);
    }
    
    setLoading(false);
  }, [id]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleLikeClick = () => {
    setLiked(!liked);
  };

  // Handle compare button click
  const handleCompareClick = () => {
    if (!modelDetails) return;
    
    if (inComparison) {
      // Remove from comparison
      const result = removeModelFromComparison(parseInt(id));
      setNotification({
        open: true,
        message: result.message,
        severity: 'info'
      });
    } else {
      // Add to comparison - first create a model object with the details
      const modelToAdd = {
        id: parseInt(id),
        name: modelDetails.name,
        description: modelDetails.description,
        tags: modelDetails.tags,
        imageUrl: modelDetails.imageUrl,
        source: modelDetails.author,
        sourceUrl: modelDetails.huggingFaceUrl || modelDetails.githubUrl,
        downloads: modelDetails.downloadCount,
        likes: modelDetails.likes
      };
      
      const result = addModelToComparison(modelToAdd);
      setNotification({
        open: true,
        message: result.message,
        severity: result.success ? 'success' : 'warning'
      });
    }
  };
  
  // Close notification
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Show loading state or error if model not found
  if (loading) {
    return (
      <>
        <Header />
        <Container sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h5">Loading model details...</Typography>
        </Container>
        <Footer />
      </>
    );
  }

  if (!modelDetails) {
    return (
      <>
        <Header />
        <Container sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h5" color="error">Model not found</Typography>
          <Button 
            variant="contained" 
            component={Link} 
            to="/discover" 
            sx={{ mt: 3 }}
          >
            Discover Models
          </Button>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Model Header */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                mb: 3, 
                border: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 300,
                backgroundColor: '#f8f9fa'
              }}
            >
              <Box
                component="img"
                src={modelDetails.imageUrl || 'https://via.placeholder.com/300x300?text=AI+Model'}
                alt={modelDetails.name}
                sx={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
              />
            </Paper>
            
            {/* Action buttons */}
            <Stack spacing={2}>
              <Button 
                variant="contained" 
                color="primary"
                fullWidth
                startIcon={<DownloadIcon />}
              >
                Download Model
              </Button>
              
              <Button 
                variant="outlined" 
                color={liked ? "secondary" : "primary"}
                fullWidth
                startIcon={<FavoriteIcon />}
                onClick={handleLikeClick}
              >
                {liked ? 'Liked' : 'Like Model'}
              </Button>
              
              <Button 
                variant={inComparison ? "contained" : "outlined"}
                color={inComparison ? "secondary" : "primary"}
                fullWidth
                startIcon={<CompareArrowsIcon />}
                onClick={handleCompareClick}
              >
                {inComparison ? 'Remove from Comparison' : 'Add to Comparison'}
              </Button>
            </Stack>
            
            {/* Model Quick Info */}
            <Paper elevation={0} sx={{ p: 3, mt: 3, border: '1px solid #e0e0e0' }}>
              <Typography variant="subtitle2" gutterBottom>
                Model Type
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {modelDetails.type}
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>
                Author
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {modelDetails.author}
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>
                License
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {modelDetails.license}
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>
                Downloads
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {modelDetails.downloadCount?.toLocaleString() || 'N/A'}
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>
                Likes
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {modelDetails.likes?.toLocaleString() || 'N/A'}
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>
                Last Updated
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {modelDetails.lastUpdated}
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>
                Links
              </Typography>
              <Stack spacing={1} direction="row" sx={{ mb: 1, flexWrap: 'wrap', gap: 1 }}>
                {modelDetails.huggingFaceUrl && (
                  <MuiLink href={modelDetails.huggingFaceUrl} target="_blank" rel="noopener">
                    <Chip icon={<LinkIcon />} label="Hugging Face" clickable size="small" />
                  </MuiLink>
                )}
                {modelDetails.githubUrl && (
                  <MuiLink href={modelDetails.githubUrl} target="_blank" rel="noopener">
                    <Chip icon={<GitHubIcon />} label="GitHub" clickable size="small" />
                  </MuiLink>
                )}
                {modelDetails.paperUrl && (
                  <MuiLink href={modelDetails.paperUrl} target="_blank" rel="noopener">
                    <Chip icon={<ArticleIcon />} label="Paper" clickable size="small" />
                  </MuiLink>
                )}
              </Stack>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={8}>
            {/* Model Name and Description */}
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom
              sx={{ fontWeight: 700 }}
            >
              {modelDetails.name}
            </Typography>
            
            <Typography 
              variant="body1" 
              paragraph
              sx={{ mb: 3 }}
            >
              {modelDetails.description}
            </Typography>
            
            {/* Tags */}
            <Box sx={{ mb: 3 }}>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {modelDetails.tags.map((tag, index) => (
                  <Chip 
                    key={index} 
                    label={tag} 
                    sx={{ 
                      backgroundColor: '#e8f4fd', 
                      color: '#0277bd',
                      m: 0.5
                    }} 
                  />
                ))}
              </Stack>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            {/* Tabs for different sections */}
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs 
                  value={tabValue} 
                  onChange={handleTabChange}
                  aria-label="model details tabs"
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab label="Overview" id="model-tab-0" />
                  <Tab label="Usage" id="model-tab-1" />
                  <Tab label="Performance" id="model-tab-2" />
                  <Tab label="Reviews" id="model-tab-3" />
                  <Tab label="Related Models" id="model-tab-4" />
                </Tabs>
              </Box>
              
              <TabPanel value={tabValue} index={0}>
                <AIModelBlog model={modelDetails} />
                {/* Show original overview content if blog generation fails */}
                {!modelDetails.longDescription ? (
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                    {modelDetails.longDescription}
                  </Typography>
                ) : null}
              </TabPanel>
              
              <TabPanel value={tabValue} index={1}>
                <Typography 
                  variant="body1" 
                  component="pre" 
                  sx={{ 
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace',
                    backgroundColor: '#f5f5f5',
                    p: 2,
                    borderRadius: 1,
                    overflowX: 'auto'
                  }}
                >
                  {modelDetails.usage}
                </Typography>
              </TabPanel>
              
              <TabPanel value={tabValue} index={2}>
                <Typography variant="h6" gutterBottom>
                  Performance Metrics
                </Typography>
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={4}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        textAlign: 'center',
                        border: '1px solid #e0e0e0'
                      }}
                    >
                      <Typography variant="h5" color="primary" gutterBottom>
                        {modelDetails.performance.accuracy ? `${modelDetails.performance.accuracy}%` : 'N/A'}
                      </Typography>
                      <Typography variant="body2">
                        Accuracy
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={4}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        textAlign: 'center',
                        border: '1px solid #e0e0e0'
                      }}
                    >
                      <Typography variant="h5" color="primary" gutterBottom>
                        {modelDetails.performance.speed || 'N/A'}
                      </Typography>
                      <Typography variant="body2">
                        Inference Speed
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={4}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        textAlign: 'center',
                        border: '1px solid #e0e0e0'
                      }}
                    >
                      <Typography variant="h5" color="primary" gutterBottom>
                        {modelDetails.performance.memoryUsage || 'N/A'}
                      </Typography>
                      <Typography variant="body2">
                        Memory Usage
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
                
                {modelDetails.performance.metrics && modelDetails.performance.metrics.length > 0 && (
                  <>
                    <Typography variant="h6" gutterBottom>
                      Additional Metrics
                    </Typography>
                    <Grid container spacing={2}>
                      {modelDetails.performance.metrics.map((metric, index) => (
                        <Grid item xs={12} sm={4} key={index}>
                          <Paper 
                            elevation={0} 
                            sx={{ 
                              p: 2, 
                              textAlign: 'center',
                              border: '1px solid #e0e0e0'
                            }}
                          >
                            <Typography variant="h6" color="primary" gutterBottom>
                              {metric.value}
                            </Typography>
                            <Typography variant="body2">
                              {metric.name}
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </>
                )}
              </TabPanel>
              
              <TabPanel value={tabValue} index={3}>
                <ReviewsSection modelId={id} modelName={modelDetails.name} />
              </TabPanel>
              
              <TabPanel value={tabValue} index={4}>
                {modelDetails.relatedModels ? (
                  <Grid container spacing={3}>
                    {modelDetails.relatedModels.map((model) => (
                      <Grid item xs={12} sm={6} key={model.id}>
                        <Card 
                          variant="outlined" 
                          sx={{ 
                            height: '100%',
                            transition: 'transform 0.2s',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                            }
                          }}
                        >
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              {model.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {model.description}
                            </Typography>
                            <Button 
                              variant="text" 
                              color="primary" 
                              sx={{ mt: 2 }} 
                              component={Link}
                              to={`/model/${model.id}`}
                            >
                              View Model
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    No related models available.
                  </Typography>
                )}
              </TabPanel>
            </Box>
          </Grid>
        </Grid>
      </Container>
      
      <Footer />
      
      {/* Notification snackbar */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={3000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ModelDetailsPage;