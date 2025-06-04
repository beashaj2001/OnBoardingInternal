"use client"

import { useState, useRef, useEffect } from "react"
import { Eye, CheckCircle, Target, Users, Check } from "lucide-react"
import Button from "../components/common/Button"
import { motion, AnimatePresence } from "framer-motion"

type Quadrant = {
  id: string
  title: string
  description: string
  bgColor: string
  borderColor: string
}

export default function VisionQuadrants() {
  const [showVision, setShowVision] = useState(false)
  const [showQuadrants, setShowQuadrants] = useState(false)
  const [hoveredQuadrant, setHoveredQuadrant] = useState<string | null>(null)
  const [showMission, setShowMission] = useState(false)
  const [showLeadership, setShowLeadership] = useState(false)
  const [completedAllSteps, setCompletedAllSteps] = useState(false)
  const [completedSteps, setCompletedSteps] = useState({
    vision: false,
    quadrants: false,
    mission: false,
    leadership: false
  })

  const missionRef = useRef<HTMLDivElement>(null)
  const leadershipRef = useRef<HTMLDivElement>(null)
  const presenceRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setCompletedAllSteps(Object.values(completedSteps).every(Boolean))
  }, [completedSteps])

  const quadrants: Quadrant[] = [
    {
      id: "transformation",
      title: "Transformation",
      description: "Relentless execution, Regulatory remediation, Modernize infrastructure, Data enhancements",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      id: "growth",
      title: "Invest for Growth",
      description: "Maximize unique global network, Grow commercial banking client sector, Scale wealth, Target share gains in Banking, Markets and U.S. Personal Banking",
      bgColor: "bg-blue-100",
      borderColor: "border-blue-300"
    },
    {
      id: "culture",
      title: "Culture & Talent",
      description: "Build winning culture, Invest in talent, Deliver One Citi",
      bgColor: "bg-blue-100",
      borderColor: "border-blue-300"
    },
    {
      id: "simplification",
      title: "Simplification",
      description: "Focus on five core interconnected businesses, Simplify the organization and management structure",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    }
  ]

  const leftQuadrants = ["transformation", "culture"]
  const rightQuadrants = ["growth", "simplification"]

  const showVisionFunc = () => {
    const newShowVision = !showVision
    setShowVision(newShowVision)
    setShowQuadrants(false)
    setShowMission(false)
    setShowLeadership(false)
    setCompletedSteps(prev => ({...prev, vision: newShowVision}))
  }

  const handleMissionClick = () => {
    const newShowMission = !showMission
    setShowMission(newShowMission)
    setShowLeadership(false)
    setCompletedSteps(prev => ({...prev, mission: newShowMission}))
    
    missionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }

  const handleLeadershipClick = () => {
    const newShowLeadership = !showLeadership
    setShowLeadership(newShowLeadership)
    setCompletedSteps(prev => ({...prev, leadership: newShowLeadership}))
    
    leadershipRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }

  const toggleQuadrants = () => {
    const newShowQuadrants = !showQuadrants
    setShowQuadrants(newShowQuadrants)
    setCompletedSteps(prev => ({...prev, quadrants: newShowQuadrants}))
  }

  const handleComplete = () => {
    alert("Module completed successfully!")
    // Additional completion logic can be added here
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center p-4 pt-20 pb-24 relative">
      {/* Vision Button */}
      <motion.div 
        initial={{ scale: 0.9 }} 
        animate={{ scale: 1 }} 
        className="w-full flex justify-center mb-8"
      >
        <Button
          onClick={showVisionFunc}
          size="lg"
          className="bg-blue-900 hover:bg-blue-800 text-white text-lg px-8 py-4 h-auto shadow-lg hover:shadow-xl transition-all"
        >
          Our Vision
        </Button>
      </motion.div>

      <div className="max-w-4xl w-full text-center">
        <AnimatePresence>
          {showVision && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="space-y-10"
            >
              {/* Vision Statement */}
              <motion.div
                className="bg-white rounded-lg shadow-lg p-8 border border-gray-200 mx-auto max-w-2xl"
                whileHover={{ scale: 1.01 }}
              >
                <p className="text-lg leading-relaxed text-gray-700">
                  Be the pre-eminent banking partner for institutions with cross-border needs, a global leader in wealth
                  management and a valued personal bank in our home market.
                </p>
              </motion.div>

              {/* Eye + Quadrants + Info Boxes */}
              <div className="grid grid-cols-[1fr_350px_1fr] items-center gap-4 w-full max-w-6xl mx-auto">
                {(() => {
                  const activeQuadrant = quadrants.find(q => q.id === hoveredQuadrant)
                  return (
                    <>
                      {/* LEFT BOX */}
                      <div className="flex justify-end">
                        <AnimatePresence>
                          {hoveredQuadrant && leftQuadrants.includes(hoveredQuadrant) && activeQuadrant ? (
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              className="w-64 p-4 bg-white border border-gray-300 rounded-lg shadow text-sm text-gray-700 text-left"
                            >
                              <ul className="list-disc list-inside space-y-1">
                                {activeQuadrant.description.split(",").map((item, idx) => (
                                  <li key={idx}>{item.trim()}</li>
                                ))}
                              </ul>
                            </motion.div>
                          ) : (
                            <div className="invisible w-64 p-4" />
                          )}
                        </AnimatePresence>
                      </div>

                      {/* CIRCLE */}
                      <div className="relative w-[350px] h-[350px] mx-auto">
                        <motion.button
                          onClick={() => {
                            setShowQuadrants(!showQuadrants)
                            setShowMission(false)
                            setShowLeadership(false)
                          }}
                          className="absolute z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        >
                          <div className="w-10 h-10 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center shadow-md">
                            <Eye className="w-6 h-6 text-blue-600" />
                          </div>
                        </motion.button>

                        <AnimatePresence>
                          {showQuadrants && (
                            <motion.div
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.5, opacity: 0 }}
                              transition={{ type: "spring", damping: 20 }}
                              className="absolute inset-0"
                            >
                              <div onMouseEnter={() => setHoveredQuadrant("transformation")} onMouseLeave={() => setHoveredQuadrant(null)} className="absolute top-2 left-2 w-[47%] h-[47%] bg-blue-50 border border-blue-200 rounded-tl-full flex items-center justify-center">
                                <span className="text-xs font-medium text-blue-900 text-center px-2 translate-x-3 translate-y-3">Transformation</span>
                              </div>
                              <div onMouseEnter={() => setHoveredQuadrant("growth")} onMouseLeave={() => setHoveredQuadrant(null)} className="absolute top-2 right-2 w-[47%] h-[47%] bg-blue-100 border border-blue-300 rounded-tr-full flex items-center justify-center">
                                <span className="text-xs font-medium text-blue-900 text-center px-2 -translate-x-3 translate-y-3">Invest for Growth</span>
                              </div>
                              <div onMouseEnter={() => setHoveredQuadrant("culture")} onMouseLeave={() => setHoveredQuadrant(null)} className="absolute bottom-2 left-2 w-[47%] h-[47%] bg-blue-100 border border-blue-300 rounded-bl-full flex items-center justify-center">
                                <span className="text-xs font-medium text-blue-900 text-center px-2 translate-x-3 -translate-y-3">Culture & Talent</span>
                              </div>
                              <div onMouseEnter={() => setHoveredQuadrant("simplification")} onMouseLeave={() => setHoveredQuadrant(null)} className="absolute bottom-2 right-2 w-[47%] h-[47%] bg-blue-50 border border-blue-200 rounded-br-full flex items-center justify-center">
                                <span className="text-xs font-medium text-blue-900 text-center px-2 -translate-x-3 -translate-y-3">Simplification</span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* RIGHT BOX */}
                      <div className="flex justify-start">
                        <AnimatePresence>
                          {hoveredQuadrant && rightQuadrants.includes(hoveredQuadrant) && activeQuadrant ? (
                            <motion.div
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 10 }}
                              className="w-64 p-4 bg-white border border-gray-300 rounded-lg shadow text-sm text-gray-700 text-left"
                            >
                              <ul className="list-disc list-inside space-y-1">
                                {activeQuadrant.description.split(",").map((item, idx) => (
                                  <li key={idx}>{item.trim()}</li>
                                ))}
                              </ul>
                            </motion.div>
                          ) : (
                            <div className="invisible w-64 p-4" />
                          )}
                        </AnimatePresence>
                      </div>
                    </>
                  )
                })()}
              </div>


              {/* Mission and Leadership Section */}
              {showQuadrants && (
                <div ref={missionRef} className="flex flex-col items-center mt-8 space-y-4">
                  <Button
                    onClick={handleMissionClick}
                    size="lg"
                    className="bg-blue-800 hover:bg-blue-700 text-white text-lg px-6 py-3 h-auto shadow-md transition-all"
                  >
                    Our Mission
                  </Button>

                  <AnimatePresence>
                    {showMission && (
                      <>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="bg-white border border-gray-200 rounded-lg shadow p-6 max-w-2xl text-center mb-4"
                        >
                          <p className="text-gray-700 text-base leading-relaxed">
                            For more than 212 years, Citi's mission has been to enable growth and economic progress for the world.
                          </p>
                        </motion.div>

                        <div ref={leadershipRef}>
                          <Button
                            onClick={handleLeadershipClick}
                            size="md"
                            className="bg-blue-700 hover:bg-blue-600 text-white px-5 py-2 h-auto shadow-sm"
                          >
                            Leadership Principles
                          </Button>
                        </div>

                        {showLeadership && (
                          <motion.ul
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={{
                              visible: { transition: { staggerChildren: 0.2 } },
                              hidden: { transition: { staggerChildren: 0.1, staggerDirection: -1 } }
                            }}
                            className="mt-2 space-y-4 text-left max-w-2xl"
                          >
                            {[
                              {
                                icon: <CheckCircle className="w-5 h-5 text-blue-700 mt-1" />,
                                text: "<strong>We take ownership</strong> – We challenge one another to a higher standard in everything we do"
                              },
                              {
                                icon: <Target className="w-5 h-5 text-blue-700 mt-1" />,
                                text: "<strong>We deliver with pride</strong> – We strive for client excellence, controls excellence and operational excellence"
                              },
                              {
                                icon: <Users className="w-5 h-5 text-blue-700 mt-1" />,
                                text: "<strong>We succeed together</strong> – We value and learn from different perspectives to surpass stakeholder expectations"
                              }
                            ].map((item, index) => (
                              <motion.li
                                key={index}
                                variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}
                                className="flex items-start gap-3 text-gray-700"
                              >
                                {item.icon}
                                <span dangerouslySetInnerHTML={{ __html: item.text }} />
                              </motion.li>
                            ))}
                          </motion.ul>
                        )}
                      </>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Completion Button */}
      <AnimatePresence>
      {showLeadership && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Button
            onClick={handleComplete}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white shadow-lg flex items-center gap-2 animate-pulse"
          >
            <Check className="w-5 h-5" />
            Mark as Completed
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
    </div>
  )
}