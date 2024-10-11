const PostCardSkeleton = () => {
	return (
		<div className="p-4 px-6 mb-10 bg-gray-300 rounded-lg dark:bg-gray-800 animate-pulse">
			{/* Loader content goes here */}
			<div className="flex items-center gap-10">
				<div className="w-16 h-16 bg-gray-200 rounded-full dark:dark:bg-gray-600"></div>
				{/* <div className="flex items-center gap-3 text-xs font-medium text-gray-600">
					<div className="w-20 h-4 bg-gray-200 rounded dark:bg-gray-600"></div>
					<div className="w-4 h-4 bg-gray-200 rounded dark:bg-gray-600"></div>
				</div> */}
				<div className="flex items-center gap-5">
					<div className="flex flex-wrap items-center gap-4">
						<div className="w-12 h-4 bg-gray-200 rounded-full dark:bg-gray-600"></div>
						<div className="w-12 h-4 bg-gray-200 rounded dark:bg-gray-600"></div>
					</div>
					{/* <div className="w-10 h-4 bg-gray-200 rounded dark:bg-gray-600"></div> */}
				</div>
			</div>

			<div className="flex items-center justify-between ">
				<div className="flex flex-col items-center gap-3">
					<div className="h-20 bg-gray-200 rounded-lg dark:bg-gray-600 w-28 animate-pulse"></div>
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 bg-gray-200 rounded-full dark:bg-gray-600"></div>
						<div className="w-4 h-4 bg-gray-200 rounded-full dark:bg-gray-600"></div>
						<div className="w-4 h-4 bg-gray-200 rounded-full dark:bg-gray-600"></div>
					</div>
				</div>
			</div>
			{/* <div className="w-full px-6 pb-4 border-b border-gray-600" /> */}
		</div>
	);
};

export default PostCardSkeleton;
