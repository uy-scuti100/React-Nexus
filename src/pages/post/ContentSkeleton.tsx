const ContentSkeleton = () => {
	return (
		<div className="w-full max-w-full mb-10 prose rounded-lg">
			{/* BREADCRUMBS */}
			<div className="flex items-center justify-between">
				<div className="h-6 mb-5 duration-300 border-gray-300 rounded-lg animate-pulse dark:border-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 w-44"></div>
				<div className="w-20 h-6 mb-3 duration-300 border-gray-300 rounded-lg animate-pulse dark:border-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"></div>
			</div>

			{/* CATEGORY AND EDIT */}
			<div className="flex items-center justify-between mt-5">
				{/* CATEGORY */}
				<div>
					<div className="w-20 h-6 mb-3 duration-300 border-gray-300 rounded-lg animate-pulse dark:border-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"></div>
				</div>

				{/* EDIT */}
				<div>
					<div className="w-24 h-6 mb-3 duration-300 border-gray-300 rounded-lg animate-pulse dark:border-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"></div>
				</div>
			</div>
			<div>
				{/* IMAGE */}
				<div className="relative py-10 my-10 mb-20 rounded-xl">
					<h1 className="mt-4 mb-8 text-xl font-bold text-center duration-300 animate-pulse"></h1>
					{/* <div className="flex items-center justify-center mb-8">
                  <div className="w-12 h-12 duration-300 border-gray-300 rounded-lg animate-pulse dark:border-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"></div>
               </div> */}
					<div className="w-40 h-5 mb-10 duration-300 border-gray-300 rounded-lg animate-pulse dark:border-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"></div>
					<div className="w-full duration-300 border-gray-300 rounded-lg h-72 animate-pulse dark:border-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"></div>
				</div>

				{/* CONTENT */}
				<div className="mb-3">
					<div className="w-full h-[80vh] animate-pulse duration-300  border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"></div>
				</div>

				{/* SUBMIT BUTTON */}
				<div className="flex justify-end">
					<button
						type="submit"
						disabled
						className="w-20 px-5 py-6 my-20 font-semibold duration-300 border-gray-300 rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 animate-pulse text-wh-10 dark:text-black"
					></button>
				</div>
			</div>

			{/* SOCIAL LINKS */}
			<div className="hidden w-1/3 mt-10 md:block">
				<div className="h-6 duration-300 border-gray-300 rounded-lg animate-pulse dark:border-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 w-36"></div>
			</div>
		</div>
	);
};

export default ContentSkeleton;
