import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GolfButton } from "@/components/ui/golf-button"
import { QrCode, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

interface HoleCardProps {
  hole: number
  par: number
  yardage: number
  currentStrokes?: number
  completed?: boolean
  onScanQR?: () => void
  onSelectHole?: () => void
  className?: string
}

export function HoleCard({
  hole,
  par,
  yardage,
  currentStrokes = 0,
  completed = false,
  onScanQR,
  onSelectHole,
  className
}: HoleCardProps) {
  const getScoreColor = () => {
    if (!completed || currentStrokes === 0) return "bg-muted"
    const diff = currentStrokes - par
    if (diff <= -2) return "bg-success"
    if (diff === -1) return "bg-golf-green"
    if (diff === 0) return "bg-golf-fairway"
    if (diff === 1) return "bg-warning"
    return "bg-destructive"
  }

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all hover:shadow-lg cursor-pointer",
      completed && "ring-2 ring-success/20",
      className
    )} onClick={onSelectHole}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm font-bold">
              HOLE {hole}
            </Badge>
            <Badge variant="secondary">
              PAR {par}
            </Badge>
          </div>
          {completed && (
            <Badge className={cn("text-white font-bold", getScoreColor())}>
              {currentStrokes}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{yardage}m</span>
          </div>
          
          <GolfButton
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onScanQR?.()
            }}
          >
            <QrCode className="h-4 w-4 mr-1" />
            QR
          </GolfButton>
        </div>
        
        {!completed && currentStrokes > 0 && (
          <div className="mt-2 pt-2 border-t">
            <div className="text-sm text-muted-foreground">
              Current: <span className="font-semibold text-foreground">{currentStrokes} strokes</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}