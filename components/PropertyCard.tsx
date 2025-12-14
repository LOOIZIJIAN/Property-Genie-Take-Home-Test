import { Property } from '@/types/property';
import { Card, CardContent, CardMedia, Typography, Box, Chip } from '@mui/material';
import { Bed, Bathtub, SquareFoot } from '@mui/icons-material';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardMedia
        component="img"
        height="200"
        image={property.images[0] || '/placeholder-property.jpg'}
        alt={property.title}
        className="h-48 object-cover"
      />
      <CardContent className="p-4">
        <Typography variant="h6" className="font-semibold mb-2 line-clamp-2">
          {property.title}
        </Typography>
        
        <Typography variant="h5" className="text-blue-600 font-bold mb-2">
          {formatPrice(property.price)}
        </Typography>
        
        <Chip 
          label={property.property_type} 
          size="small" 
          className="mb-3"
          color="primary"
          variant="outlined"
        />
        
        <Box className="flex items-center gap-4 mb-3 text-gray-600">
          <Box className="flex items-center gap-1">
            <Bed fontSize="small" />
            <Typography variant="body2">{property.bedrooms}</Typography>
          </Box>
          <Box className="flex items-center gap-1">
            <Bathtub fontSize="small" />
            <Typography variant="body2">{property.bathrooms}</Typography>
          </Box>
          <Box className="flex items-center gap-1">
            <SquareFoot fontSize="small" />
            <Typography variant="body2">{property.size} sq ft</Typography>
          </Box>
        </Box>
        
        <Typography variant="body2" className="text-gray-600 mb-2">
          {property.location.address}
        </Typography>
        
        <Typography variant="body2" className="text-gray-500">
          {property.location.city}, {property.location.state}
        </Typography>
      </CardContent>
    </Card>
  );
}