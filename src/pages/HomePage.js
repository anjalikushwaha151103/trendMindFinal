import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Divider,
  Paper,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Snackbar,
  Alert
} from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ModelCard from '../components/ModelCard';
import { useComparison } from '../contexts/ComparisonContext';

// Mock data
const trendingModels = [
  {
    id: 1,
    name: 'GPT-4 Turbo',
    description: 'OpenAI\'s advanced language model that excels at understanding and generating human-like text for various tasks. It demonstrates significant improvements in reasoning, factuality, and instruction following compared to previous versions, making it suitable for complex language-based applications.',
    tags: ['NLP', 'Text Generation', 'Large Language Model'],
    imageUrl: '/assets/model1.png',
    compareEnabled: true,
    downloads: 245800,
    likes: 5627
  },
  {
    id: 2,
    name: 'Stable Diffusion XL',
    description: 'A powerful text-to-image generation model that creates high-quality, detailed images from textual descriptions. It offers improved composition, face generation, and image quality over previous diffusion models, with enhanced understanding of prompts and artistic styles.',
    tags: ['Computer Vision', 'Image Generation', 'Diffusion Model'],
    imageUrl: '/assets/model2.png',
    compareEnabled: true,
    downloads: 183500,
    likes: 4253
  },
  {
    id: 3,
    name: 'Whisper Large v3',
    description: 'State-of-the-art speech recognition model that accurately transcribes spoken language across multiple languages and accents. It demonstrates robust performance in noisy environments and handles various speaking styles while maintaining high accuracy for specialized terminology.',
    tags: ['Speech Recognition', 'Audio Processing', 'Multilingual'],
    imageUrl: '/assets/model3.png',
    compareEnabled: true,
    downloads: 137900,
    likes: 3182
  },
];

const recommendedModel = {
  id: 4,
  name: 'Claude 3 Opus',
  description: 'Anthropic\'s flagship multimodal AI assistant with exceptional reasoning abilities and comprehensive understanding of both text and images. It excels at complex problem-solving tasks requiring nuanced analysis and can effectively process and interpret visual information alongside textual content.',
  features: [
    {
      title: 'Performance',
      description: 'Claude 3 Opus demonstrates state-of-the-art performance across multiple benchmarks, including tasks requiring deep reasoning, factual knowledge, and multimodal understanding. It shows significant improvements in handling complex instructions and maintaining context throughout extended conversations.'
    },
    {
      title: 'Accuracy',
      description: 'With enhanced training on diverse datasets and improved alignment techniques, Claude 3 Opus achieves remarkable accuracy in providing factual information while reducing hallucinations. Its responses are well-calibrated with appropriate expressions of uncertainty when faced with ambiguous queries.'
    }
  ],
  imageUrl: '/assets/featured-model.png',
  compareEnabled: true,
  downloads: 192650,
  likes: 4836
};

const userReviews = [
  {
    id: 1,
    text: '"A one-stop AI discovery hub!"',
    author: 'Sara P.',
    role: 'ML Engineer',
    avatar: '/assets/avatar1.png'
  },
  {
    id: 2,
    text: '"Super useful, just needs more filters"',
    author: 'Jared L.',
    role: 'Tech Researcher',
    avatar: '/assets/avatar2.png'
  },
  {
    id: 3,
    text: '"Perfect for AI enthusiasts!"',
    author: 'Nora D.',
    role: 'Data Scientist',
    avatar: '/assets/avatar3.png'
  }
];

const HomePage = () => {
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const { addModelToComparison, removeModelFromComparison, isModelInComparison } = useComparison();
  
  // Check if the recommended model is in comparison
  const inComparison = isModelInComparison(recommendedModel.id);
  
  // Handle compare button click for recommended model
  const handleCompareClick = () => {
    if (inComparison) {
      // Remove from comparison
      const result = removeModelFromComparison(recommendedModel.id);
      setNotification({
        open: true,
        message: result.message,
        severity: 'info'
      });
    } else {
      // Add to comparison
      const result = addModelToComparison(recommendedModel);
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
  
  return (
    <>
      <Header />
      
      <Box 
        sx={{
          backgroundColor: '#e8f4fd',
          py: 8,
          mb: 6
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 700,
                  color: '#18445c'
                }}
              >
                TrendMind
              </Typography>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  mb: 3,
                  color: '#546e7a',
                  fontSize: '1.1rem'
                }}
              >
                Compare, Explore, and Review Latest AI Models.
              </Typography>
              
              <Typography 
                paragraph 
                sx={{ 
                  mb: 4,
                  color: '#546e7a',
                  lineHeight: 1.7
                }}
              >
                An intelligent discovery and summarization tool that keeps you effortlessly updated with the latest trends, breakthroughs, and insights in AI and technology. It scouts across multiple sources, identifies emerging topics, and generates digestible summaries tailored to your interests. Whether you're a researcher, developer, or AI enthusiast, TrendMind saves you hours of scrolling and brings the most relevant knowledge straight to you.
              </Typography>
              
              <Button 
                variant="contained" 
                size="large" 
                color="primary" 
                component={RouterLink} 
                to="/discover"
                sx={{ 
                  py: 1.5,
                  px: 4,
                  fontSize: '1rem'
                }}
              >
                Explore Models
              </Button>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/assets/hero-image.png"
                alt="AI technology illustration"
                sx={{
                  width: '100%',
                  maxHeight: 400,
                  objectFit: 'contain',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      <Container maxWidth="lg">
        {/* Trending Models Section */}
        <Box sx={{ mb: 8 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            sx={{ 
              mb: 4,
              fontWeight: 600,
              color: '#18445c'
            }}
          >
            Trending Model
          </Typography>
          
          <Divider sx={{ mb: 4 }} />
          
          <Grid container spacing={3}>
            {trendingModels.map((model) => (
              <Grid item xs={12} sm={6} md={4} key={model.id}>
                <ModelCard model={model} />
              </Grid>
            ))}
          </Grid>
        </Box>
        
        {/* Recommended Section */}
        <Box sx={{ mb: 8 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            sx={{ 
              mb: 4,
              fontWeight: 600,
              color: '#18445c'
            }}
          >
            Recommended
          </Typography>
          
          <Divider sx={{ mb: 4 }} />
          
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3,
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              gap: 4
            }}
          >
            <Box 
              sx={{ 
                width: { xs: '100%', md: '40%' },
                height: 300,
                bgcolor: '#f5f7f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              <Box
                component="img"
                src="/assets/featured-model.png"
                alt={recommendedModel.name}
                sx={{
                  maxWidth: '80%',
                  maxHeight: '80%',
                  objectFit: 'contain',
                }}
              />
            </Box>
            
            <Box sx={{ width: { xs: '100%', md: '60%' } }}>
              <Typography variant="h5" component="h3" gutterBottom>
                {recommendedModel.name}
              </Typography>
              
              <Typography variant="body1" paragraph>
                {recommendedModel.description}
              </Typography>
              
              {recommendedModel.features.map((feature, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Box>
              ))}
              
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  component={RouterLink} 
                  to={`/model/${recommendedModel.id}`}
                >
                  View More
                </Button>
                
                <Button 
                  variant={inComparison ? "contained" : "outlined"}
                  color={inComparison ? "secondary" : "primary"}
                  startIcon={<CompareArrowsIcon />}
                  onClick={handleCompareClick}
                >
                  {inComparison ? 'Remove from Comparison' : 'Add to Comparison'}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
        
        {/* User Reviews Section */}
        <Box sx={{ mb: 8 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            sx={{ 
              mb: 4,
              fontWeight: 600,
              color: '#18445c'
            }}
          >
            User Reviews
          </Typography>
          
          <Divider sx={{ mb: 4 }} />
          
          <Grid container spacing={3}>
            {userReviews.map((review) => (
              <Grid item xs={12} sm={6} md={4} key={review.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    backgroundColor: '#f8fbfd',
                    border: '1px solid #e0e9ef'
                  }}
                >
                  <CardContent>
                    <Typography 
                      variant="body1" 
                      component="p" 
                      gutterBottom
                      sx={{ 
                        fontStyle: 'italic',
                        fontWeight: 500,
                        mb: 2
                      }}
                    >
                      {review.text}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                      <Avatar 
                        src={review.avatar} 
                        alt={review.author}
                        sx={{ mr: 2 }}
                      />
                      <Box>
                        <Typography variant="subtitle2">
                          {review.author}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {review.role}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
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

export default HomePage; 