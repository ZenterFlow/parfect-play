import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HoleCard } from "@/components/ui/hole-card"
import { Scorecard } from "@/components/ui/scorecard"
import { GolfButton } from "@/components/ui/golf-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { MapPin, Clock, Users, Zap } from "lucide-react"

interface HoleData {
  hole: number
  par: number
  yardage: number
}

interface HoleScore {
  hole: number
  par: number
  strokes: number
  putts?: number
  completed: boolean
}

const courseData: HoleData[] = [
  { hole: 1, par: 3, yardage: 120 },
  { hole: 2, par: 3, yardage: 95 },
  { hole: 3, par: 3, yardage: 132 },
  { hole: 4, par: 3, yardage: 108 },
  { hole: 5, par: 3, yardage: 145 },
  { hole: 6, par: 3, yardage: 87 },
  { hole: 7, par: 3, yardage: 156 },
  { hole: 8, par: 3, yardage: 101 },
  { hole: 9, par: 3, yardage: 128 },
]

export function GolfCourseLayout() {
  const [currentHole, setCurrentHole] = useState(1)
  const [currentLoop, setCurrentLoop] = useState<1 | 2>(1)
  const [activeTab, setActiveTab] = useState("course")
  
  const [loop1Scores, setLoop1Scores] = useState<HoleScore[]>(
    courseData.map(hole => ({
      ...hole,
      strokes: 0,
      completed: false
    }))
  )
  
  const [loop2Scores, setLoop2Scores] = useState<HoleScore[]>(
    courseData.map(hole => ({
      ...hole,
      strokes: 0,
      completed: false
    }))
  )

  const handleScanQR = (hole: number) => {
    setCurrentHole(hole)
    // Simulate QR scan loading hole data
    console.log(`QR scanned for hole ${hole}`)
  }

  const handleUpdateScore = (loop: 1 | 2, hole: number, strokes: number) => {
    const updateScores = loop === 1 ? setLoop1Scores : setLoop2Scores
    updateScores(prev => prev.map(score => 
      score.hole === hole 
        ? { ...score, strokes, completed: strokes > 0 }
        : score
    ))
  }

  const handleSwitchLoop = () => {
    setCurrentLoop(currentLoop === 1 ? 2 : 1)
  }

  const getCurrentHoleData = () => {
    return courseData.find(h => h.hole === currentHole) || courseData[0]
  }

  const currentHoleData = getCurrentHoleData()
  const currentScores = currentLoop === 1 ? loop1Scores : loop2Scores
  const currentHoleScore = currentScores.find(s => s.hole === currentHole)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Swiss-Card Golf Cloud</h1>
              <p className="text-muted-foreground">9-Hole Par-3 Course • Loop {currentLoop} of 2</p>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              <MapPin className="w-4 h-4 mr-2" />
              Hole {currentHole}
            </Badge>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-sm text-muted-foreground">Pace</div>
                <div className="font-bold">12:30</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-sm text-muted-foreground">Group</div>
                <div className="font-bold">G-1027</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Zap className="w-6 h-6 mx-auto mb-2 text-success" />
                <div className="text-sm text-muted-foreground">GPS</div>
                <div className="font-bold">±3m</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="w-6 h-6 mx-auto mb-2 bg-golf-green rounded-full"></div>
                <div className="text-sm text-muted-foreground">Pin</div>
                <div className="font-bold">Front-L</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="course">Course</TabsTrigger>
            <TabsTrigger value="scorecard">Scorecard</TabsTrigger>
            <TabsTrigger value="current">Current Hole</TabsTrigger>
          </TabsList>

          <TabsContent value="course" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-golf-green rounded-full"></div>
                  9-Hole Course Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {courseData.map((hole) => {
                    const score = currentScores.find(s => s.hole === hole.hole)
                    return (
                      <HoleCard
                        key={hole.hole}
                        hole={hole.hole}
                        par={hole.par}
                        yardage={hole.yardage}
                        currentStrokes={score?.strokes}
                        completed={score?.completed}
                        onScanQR={() => handleScanQR(hole.hole)}
                        onSelectHole={() => setCurrentHole(hole.hole)}
                        className={hole.hole === currentHole ? "ring-2 ring-primary" : ""}
                      />
                    )
                  })}
                </div>
                
                {currentLoop === 1 && loop1Scores.every(s => s.completed) && (
                  <div className="mt-6 p-4 bg-success/10 rounded-lg border border-success/20">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-success mb-2">
                        Loop 1 Complete!
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Ready to start Loop 2?
                      </p>
                      <GolfButton
                        variant="success"
                        onClick={handleSwitchLoop}
                        className="w-full md:w-auto"
                      >
                        Start Loop 2
                      </GolfButton>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scorecard">
            <Scorecard
              playerName="Player"
              currentHole={currentHole}
              currentLoop={currentLoop}
              loop1Scores={loop1Scores}
              loop2Scores={loop2Scores}
              onUpdateScore={handleUpdateScore}
              onSwitchLoop={handleSwitchLoop}
            />
          </TabsContent>

          <TabsContent value="current" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  Hole {currentHole} • Par {currentHoleData.par}
                </CardTitle>
                <p className="text-muted-foreground">
                  {currentHoleData.yardage} meters • Loop {currentLoop}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Current Score</h3>
                    <div className="flex items-center gap-4">
                      <GolfButton
                        variant="outline"
                        size="lg"
                        onClick={() => handleUpdateScore(currentLoop, currentHole, Math.max(1, (currentHoleScore?.strokes || 1) - 1))}
                        disabled={(currentHoleScore?.strokes || 1) <= 1}
                      >
                        -
                      </GolfButton>
                      
                      <div className="text-center">
                        <div className="text-3xl font-bold">
                          {currentHoleScore?.strokes || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">strokes</div>
                      </div>
                      
                      <GolfButton
                        variant="outline"
                        size="lg"
                        onClick={() => handleUpdateScore(currentLoop, currentHole, (currentHoleScore?.strokes || 0) + 1)}
                        disabled={(currentHoleScore?.strokes || 0) >= 10}
                      >
                        +
                      </GolfButton>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Hole Info</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Distance:</span>
                        <span className="font-medium">{currentHoleData.yardage}m</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pin Position:</span>
                        <span className="font-medium">Front-Left</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Wind:</span>
                        <span className="font-medium">Light NE</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <GolfButton 
                    variant="fairway" 
                    className="flex-1"
                    onClick={() => handleScanQR(currentHole)}
                  >
                    Scan QR Code
                  </GolfButton>
                  <GolfButton 
                    variant="green"
                    className="flex-1"
                    onClick={() => {
                      if (currentHoleScore && currentHoleScore.strokes > 0) {
                        handleUpdateScore(currentLoop, currentHole, currentHoleScore.strokes)
                        const nextHole = currentHole < 9 ? currentHole + 1 : 1
                        setCurrentHole(nextHole)
                      }
                    }}
                    disabled={!currentHoleScore?.strokes || currentHoleScore.strokes === 0}
                  >
                    Complete Hole
                  </GolfButton>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}