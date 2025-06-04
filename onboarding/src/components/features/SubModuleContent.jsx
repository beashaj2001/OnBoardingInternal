import React from "react";
import { Video, FileText, Download, ChevronRight } from "lucide-react";
import Card from "../common/Card";
import Button from "../common/Button";

const SubModuleContent = ({ subModule }) => {
  if (!subModule) {
    return <div>No submodule data available.</div>;
  }

  console.log("subModule");
  console.log(subModule);

  return (
    <div className="space-y-6">
      {/* Main Content Section */}
      {subModule.type === "video" && (
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Video className="w-6 h-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Video
            </h3>
          </div>

          {subModule.videoUrl ? (
            // Render standard video tag for the video URL
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
              <video
                src={subModule.videoUrl}
                className="w-full h-full"
                controls
                poster={subModule.thumbnail}
              />
            </div>
          ) : (
            // Placeholder if no videoUrl is available
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4 text-gray-500 dark:text-gray-400">
              No video available
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                {subModule.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {subModule.duration}
              </p>
            </div>
            {/* Assuming download is only for video if videoUrl exists */}
            {subModule.videoUrl && (
              <Button variant="outline" size="sm" icon={<Download size={16} />}>
                Download Video
              </Button>
            )}
          </div>
        </Card>
      )}

      {subModule.type === "text" && (
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <FileText className="w-6 h-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Reading
            </h3>
          </div>
          {/* You can add actual text content rendering here if needed */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                {subModule.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {subModule.duration}
              </p>
            </div>
            {/* Add any text-specific actions here if needed */}
          </div>
        </Card>
      )}

      {/* Resources Section - Render only if resources exist and are not empty */}
      {subModule.resources && subModule.resources.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <FileText className="w-6 h-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Resources
            </h3>
          </div>

          <div className="space-y-4">
            {subModule.resources.map((resource, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {resource.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {resource.description}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  icon={
                    resource.type === "link" ? (
                      <ChevronRight size={16} />
                    ) : (
                      <Download size={16} />
                    )
                  }
                >
                  {resource.type === "link" ? "Access" : "Download"}
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default SubModuleContent;
