import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Video } from "@/lib/types";

interface VideoCardProps {
  video: Video;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <Card className="pt-0 h-full transition-all hover:shadow-lg hover:border-primary/50">
      <CardHeader className="p-0 space-y-0">
        <iframe
          src={video.url}
          title={video.title}
          loading="lazy"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="w-full aspect-video rounded-t-xl"
        />
        <div className="p-6 space-y-2">
          <CardTitle className="text-xl font-serif line-clamp-2 leading-7">
            {video.title}
          </CardTitle>
          <CardDescription className="line-clamp-3">
            {video.description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={video.author.image} alt={video.author.name} />
            <AvatarFallback>{getInitials(video.author.name)}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">
            {video.author.name}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
