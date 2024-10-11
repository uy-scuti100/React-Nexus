import { useEffect, useState } from "react";
import supabase from "../../lib/supabaseClient";
import { BiChevronUp } from "react-icons/bi";
import { Link } from "react-router-dom";

const Topics = () => {
	const [topics, setTopics] = useState<
		Array<{
			name: string;
			description: string;
			id: string;
			expanded: boolean;
		}>
	>([]);
	const scrollToTop = () => {
		window.scrollTo({ top: 0 });
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const { data: topicsData, error: topicsError } = await supabase
					.from("topics")
					.select("*");

				if (topicsError) {
					console.error("Error fetching topics:", topicsError);
					return;
				}

				// Initialize the 'expanded' property for each topic
				const topicsWithExpansion = topicsData.map((topic) => ({
					...topic,
					expanded: false,
				}));

				setTopics(topicsWithExpansion);
			} catch (error) {
				console.error("An error occurred:", error);
			}
		};

		fetchData();
	}, []);

	const toggleTopic = (topicId: string) => {
		setTopics((prevTopics) =>
			prevTopics.map((topic) => {
				if (topic.id === topicId) {
					return { ...topic, expanded: !topic.expanded };
				}
				return { ...topic, expanded: false }; // Close other topics
			})
		);
	};

	return (
		<main className="relative max-w-[1440px]">
			<section className="grid-cols-3 gap-6 px-6 pt-2 md:gap-8 md:grid ">
				{topics.map((topic) => (
					<div key={topic.id} className="col-span-3 md:col-span-1">
						<div
							className="flex items-center justify-between w-full py-5 border-t cursor-pointer border-foreground/5"
							onClick={() => toggleTopic(topic.id)}
						>
							<h1 className="text-xl font-black">{topic.name}</h1>
							<BiChevronUp
								className={`md:hidden ${
									topic.expanded
										? "transform rotate-180 duration-300 transition-all"
										: ""
								}`}
							/>
						</div>
						{topic.expanded && (
							<div>
								<Link
									to={`/tag/${topic.id}`}
									onClick={scrollToTop}
									className="pl-6 text-lg font-semibold hover:underline"
								>
									{topic.name}
								</Link>
								<div className="pl-12">
									<Subtopics parentId={topic.id} />
								</div>
							</div>
						)}
					</div>
				))}
			</section>
		</main>
	);
};

const Subtopics = ({ parentId }: { parentId: string }) => {
	const [subtopics, setSubtopics] = useState<
		Array<{
			name: string;
			description: string;
			id: string;
			expanded: boolean;
		}>
	>([]);
	const scrollToTop = () => {
		window.scrollTo({ top: 0 });
	};

	useEffect(() => {
		const fetchSubtopics = async () => {
			try {
				const { data: subtopicsData, error } = await supabase
					.from("subtopics")
					.select("*")
					.eq("parent_topic_id", parentId);

				if (error) {
					console.error("Error fetching subtopics:", error);
					return;
				}

				// Initialize the 'expanded' property for each subtopic
				const subtopicsWithExpansion = subtopicsData.map((subtopic) => ({
					...subtopic,
					expanded: false,
				}));

				setSubtopics(subtopicsWithExpansion);
			} catch (error) {
				console.error("An error occurred:", error);
			}
		};

		fetchSubtopics();
	}, [parentId]);

	const toggleSubtopic = (subtopicId: string) => {
		setSubtopics((prevSubtopics) =>
			prevSubtopics.map((subtopic) => {
				if (subtopic.id === subtopicId) {
					return { ...subtopic, expanded: !subtopic.expanded };
				}
				return { ...subtopic, expanded: false };
			})
		);
	};

	return (
		<div className="pl-6">
			{subtopics.map((subtopic) => (
				<div key={subtopic.id} className="cursor-pointer">
					<div
						className="flex items-center justify-between w-full py-3"
						onClick={() => toggleSubtopic(subtopic.id)}
					>
						<h1 className="text-lg">{subtopic.name}</h1>
						<BiChevronUp
							className={`md:hidden ${
								subtopic.expanded
									? "transform rotate-180 duration-300 transition-all"
									: ""
							}`}
						/>
					</div>
					{subtopic.expanded && (
						<Link to={`/subtopic/${subtopic.id}`} onClick={scrollToTop}>
							<h1 className="pl-6 text-sm hover:underline ">{subtopic.name}</h1>
							<SubSubtopics parentId={subtopic.id} />
						</Link>
					)}
				</div>
			))}
		</div>
	);
};

const SubSubtopics = ({ parentId }: { parentId: string }) => {
	const [subsubtopics, setSubSubtopics] = useState<
		Array<{ name: string; description: string; id: string }>
	>([]);

	useEffect(() => {
		const fetchSubSubtopics = async () => {
			try {
				const { data: subsubtopicsData, error } = await supabase
					.from("subsubtopics")
					.select("*")
					.eq("parent_subtopic_id", parentId);

				if (error) {
					console.error("Error fetching subsubtopics:", error);
					return;
				}

				setSubSubtopics(subsubtopicsData);
			} catch (error) {
				console.error("An error occurred:", error);
			}
		};

		fetchSubSubtopics();
	}, [parentId]);
	const scrollToTop = () => {
		window.scrollTo({ top: 0 });
	};
	return (
		<div className="pl-6">
			{subsubtopics.map((subsubtopic) => (
				<Link
					to={`/subsubtopic/${subsubtopic.id}`}
					key={subsubtopic.id}
					onClick={scrollToTop}
				>
					<h1 className="py-3 text-sm hover:underline">{subsubtopic.name}</h1>
				</Link>
			))}
		</div>
	);
};

export default Topics;
