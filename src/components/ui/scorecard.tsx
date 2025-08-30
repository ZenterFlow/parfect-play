import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GolfButton } from "@/components/ui/golf-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Minus, Plus, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

interface HoleScore {
  hole: number
  par: number
  strokes: number
  putts?: number
  completed: boolean
}

interface ScorecardProps {
  playerName?: string
  currentHole: number
  currentLoop: 1 | 2
  loop1Scores: HoleScore[]
  loop2Scores: HoleScore[]
  onUpdateScore: (loop: 1 | 2, hole: number, strokes: number) => void
  onSwitchLoop?: () => void
  className?: string
}

export function Scorecard({
  playerName = "Player",
  currentHole,
  currentLoop,
  loop1Scores,
  loop2Scores,
  onUpdateScore,
  onSwitchLoop,
  className
}: ScorecardProps) {
  const getScoreDisplay = (strokes: number, par: number) => {
    const diff = strokes - par
    if (diff <= -2) return { text: "Eagle", color: "bg-success" }
    if (diff === -1) return { text: "Birdie", color: "bg-golf-green" }
    if (diff === 0) return { text: "Par", color: "bg-golf-fairway" }
    if (diff === 1) return { text: "Bogey", color: "bg-warning" }
    return { text: `+${diff}`, color: "bg-destructive" }
  }

  const calculateTotal = (scores: HoleScore[]) => {
    return scores.reduce((total, score) => total + (score.completed ? score.strokes : 0), 0)
  }

  const calculatePar = (scores: HoleScore[]) => {
    return scores.reduce((total, score) => total + score.par, 0)
  }

  const renderLoop = (scores: HoleScore[], loopNumber: 1 | 2) => (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {scores.map((score) => (
          <Card key={`${loopNumber}-${score.hole}`} className={cn(
            "transition-all",
            score.hole === currentHole && loopNumber === currentLoop && "ring-2 ring-primary"
          )}>
            <CardContent className="p-3 text-center">
              <div className="text-sm font-medium mb-2">
                Hole {score.hole}
              </div>
              <Badge variant="outline" className="mb-2">
                Par {score.par}
              </Badge>
              
              <div className="flex items-center justify-center gap-1 mb-2">
                <GolfButton
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onUpdateScore(loopNumber, score.hole, Math.max(1, score.strokes - 1))}
                  disabled={score.strokes <= 1}
                >
                  <Minus className="h-3 w-3" />
                </GolfButton>
                
                <div className="w-12 text-center font-bold text-lg">
                  {score.completed ? score.strokes : score.strokes || '-'}
                </div>
                
                <GolfButton
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onUpdateScore(loopNumber, score.hole, score.strokes + 1)}
                  disabled={score.strokes >= 10}
                >
                  <Plus className="h-3 w-3" />
                </GolfButton>
              </div>
              
              {score.completed && score.strokes > 0 && (
                <Badge className={cn("text-xs", getScoreDisplay(score.strokes, score.par).color)}>
                  {getScoreDisplay(score.strokes, score.par).text}
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-muted-foreground">Total</div>
              <div className="text-2xl font-bold">
                {calculateTotal(scores)} / {calculatePar(scores)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">
                {scores.filter(s => s.completed).length} / 9 holes
              </div>
              <div className="text-sm font-medium">
                {calculateTotal(scores) - calculatePar(scores) > 0 ? '+' : ''}{calculateTotal(scores) - calculatePar(scores)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{playerName}'s Scorecard</CardTitle>
          <Badge variant="outline">
            Hole {currentHole} • Loop {currentLoop}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={`loop${currentLoop}`} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="loop1" onClick={() => onSwitchLoop?.()}>
              Loop 1 ({calculateTotal(loop1Scores)})
            </TabsTrigger>
            <TabsTrigger value="loop2" onClick={() => onSwitchLoop?.()}>
              Loop 2 ({calculateTotal(loop2Scores)})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="loop1">
            {renderLoop(loop1Scores, 1)}
          </TabsContent>
          
          <TabsContent value="loop2">
            {renderLoop(loop2Scores, 2)}
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">18-Hole Total</span>
            <span className="font-bold text-lg">
              {calculateTotal(loop1Scores) + calculateTotal(loop2Scores)} / {calculatePar(loop1Scores) + calculatePar(loop2Scores)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}