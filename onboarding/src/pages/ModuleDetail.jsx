const ModuleDetail = () => {
  return (
    <div>
      <h1>Module Detailssss</h1>
      {/* Add your component content here */}
    </div>
  );
};

// Previous ModuleDetail.jsx content remains the same, but update the mockSubModules:

const mockSubModules = [
  {
    id: "1",
    title: "Introduction to Safety Equipment",
    description:
      "Learn about basic safety gear and their proper usage. This module covers all essential protective equipment and their applications in different workplace scenarios.",
    type: "video",
    duration: "10 min",
    status: "completed",
    progress: 100,
    difficulty: "beginner",
    estimatedTime: "10-15 min",
    thumbnail:
      "https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg",
    prerequisites: [],
  },
  {
    id: "2",
    title: "Equipment Operation Demo",
    description:
      "Interactive 3D demonstration of equipment operation. Practice with virtual machinery to understand proper handling techniques and safety procedures.",
    type: "3d",
    duration: "15 min",
    status: "in-progress",
    progress: 60,
    difficulty: "intermediate",
    estimatedTime: "15-20 min",
    thumbnail:
      "https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg",
    prerequisites: ["Introduction to Safety Equipment"],
  },
  {
    id: "3",
    title: "Safety Protocols",
    description:
      "Detailed safety protocols and procedures for emergency situations. Learn how to respond to various workplace incidents and maintain a safe environment.",
    type: "text",
    duration: "20 min",
    status: "locked",
    progress: 0,
    difficulty: "advanced",
    estimatedTime: "20-25 min",
    thumbnail:
      "https://images.pexels.com/photos/257636/pexels-photo-257636.jpeg",
    prerequisites: ["Equipment Operation Demo"],
  },
];

export default ModuleDetail;