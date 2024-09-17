import { Button, Divider, Link, Popover, PopoverContent, PopoverTrigger, ScrollShadow } from '@nextui-org/react';
import { remark } from 'remark';
import html from 'remark-html';
import { Worklogs } from '@/app/worklogs/_actions';

export const IssuesTableCell = ({ data }: Readonly<{ data: Worklogs[number] }>) => {
	return (
		<ScrollShadow
			className="ml-4 flex w-[33dvw] max-w-[500px] grow-0 flex-nowrap items-center gap-2"
			orientation="horizontal"
			hideScrollBar
			size={50}>
			{data.issues.map((i) => (
				<Popover key={i.key}>
					<PopoverTrigger>
						<Button
							className="shrink-0"
							variant="flat"
							size="sm">
							{i.key}
						</Button>
					</PopoverTrigger>
					<PopoverContent>
						<Link
							isExternal
							showAnchorIcon
							href={i.url}>
							{typeof i.name === 'string' ? i.name : i.key}
						</Link>
						{typeof i.description === 'string' && (
							<>
								<Divider />
								<div
									className="prose prose-sm dark:prose-invert"
									dangerouslySetInnerHTML={{
										__html: remark().use(html).processSync(i.description).toString()
									}}
								/>
							</>
						)}
					</PopoverContent>
				</Popover>
			))}
		</ScrollShadow>
	);
};
