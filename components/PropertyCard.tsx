import { Property } from '@/types/property';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { Bed, Bathtub, SquareFoot, LocationOn } from '@mui/icons-material';
import Image from 'next/image';

interface PropertyCardProps {
  property: Property;
  viewMode?: 'grid' | 'list';
}

export default function PropertyCard({ property, viewMode = 'grid' }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const isList = viewMode === 'list';

  return (
    <Card
      className={`h-full hover:shadow-xl transition-all duration-300 group overflow-hidden ${
        isList ? 'flex flex-col sm:flex-row' : ''
      }`}
      elevation={1}
    >
      <Box className={`relative overflow-hidden ${
        isList ? 'w-full sm:w-1/3 h-64 sm:h-auto' : 'h-56'
      }`}>
        <Image
          src={property.images[0] || '/placeholder-property.jpg'}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes={isList ? "(max-width: 640px) 100vw, 33vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"}
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="
        />
        <Chip 
            label={property.property_type}
            size="small"
            className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm font-semibold"
            color="default"
        />
        <Box className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Typography variant="caption" className="text-white font-medium">
                Added {new Date(property.created_at).toLocaleDateString()}
            </Typography>
        </Box>
      </Box>

      <CardContent className={`p-5 flex flex-col justify-between ${
        isList ? 'w-full sm:w-2/3' : ''
      }`}>
        <Box>
            <Box className="flex justify-between items-start mb-2">
                <Typography variant="h6" className="font-bold line-clamp-2 leading-tight flex-1 mr-2 text-gray-800">
                {property.title}
                </Typography>
                <Typography variant="h6" className="text-blue-600 font-bold whitespace-nowrap">
                {formatPrice(property.price)}
                </Typography>
            </Box>

            <Box className="flex items-center text-gray-500 mb-4 gap-1">
                <LocationOn fontSize="small" className="text-gray-400" />
                <Typography variant="body2" className="line-clamp-1">
                    {property.location.address}, {property.location.city}
                </Typography>
            </Box>

            <Box className="flex items-center gap-6 mb-4 text-gray-600 border-t border-b border-gray-100 py-3">
            <Box className="flex items-center gap-2">
                <Bed fontSize="small" className="text-gray-400" />
                <Typography variant="body2" className="font-medium">{property.bedrooms} <span className="text-gray-400 font-normal hidden sm:inline">Beds</span></Typography>
            </Box>
            <Box className="flex items-center gap-2">
                <Bathtub fontSize="small" className="text-gray-400" />
                <Typography variant="body2" className="font-medium">{property.bathrooms} <span className="text-gray-400 font-normal hidden sm:inline">Baths</span></Typography>
            </Box>
            <Box className="flex items-center gap-2">
                <SquareFoot fontSize="small" className="text-gray-400" />
                <Typography variant="body2" className="font-medium">{property.size} <span className="text-gray-400 font-normal hidden sm:inline">sq ft</span></Typography>
            </Box>
            </Box>
        </Box>
        
        <Box className="flex items-center justify-between mt-auto">
            <Typography variant="caption" className="text-gray-400">
                ID: {property.id}
            </Typography>
            {isList && (
                <Typography variant="body2" className="text-blue-600 font-semibold cursor-pointer hover:underline">
                    View Details
                </Typography>
            )}
        </Box>
      </CardContent>
    </Card>
  );
}
