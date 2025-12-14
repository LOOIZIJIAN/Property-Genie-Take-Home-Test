import { Card, CardContent, Box, Skeleton } from '@mui/material';

interface SkeletonPropertyCardProps {
  viewMode?: 'grid' | 'list';
}

export default function SkeletonPropertyCard({ viewMode = 'grid' }: SkeletonPropertyCardProps) {
  const isList = viewMode === 'list';

  return (
    <Card
      className={`h-full overflow-hidden ${
        isList ? 'flex flex-col sm:flex-row' : ''
      }`}
      elevation={1}
    >
      <Box className={`relative ${
        isList ? 'w-full sm:w-1/3 h-64 sm:h-auto' : 'h-56'
      }`}>
        <Skeleton variant="rectangular" width="100%" height="100%" />
      </Box>

      <CardContent className={`p-5 flex flex-col justify-between ${
        isList ? 'w-full sm:w-2/3' : ''
      }`}>
        <Box>
            <Box className="flex justify-between items-start mb-2">
                <Skeleton variant="text" width="60%" height={32} />
                <Skeleton variant="text" width="25%" height={32} />
            </Box>

            <Box className="flex items-center mb-4 gap-1">
                <Skeleton variant="circular" width={16} height={16} />
                <Skeleton variant="text" width="40%" />
            </Box>

            <Box className="flex items-center gap-6 mb-4 py-3">
                <Skeleton variant="text" width={40} />
                <Skeleton variant="text" width={40} />
                <Skeleton variant="text" width={60} />
            </Box>
        </Box>

        <Box className="flex items-center justify-between mt-auto">
             <Skeleton variant="text" width="20%" />
        </Box>
      </CardContent>
    </Card>
  );
}
