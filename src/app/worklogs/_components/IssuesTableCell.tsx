import { Button, Divider, Link, Popover, PopoverContent, PopoverTrigger, ScrollShadow } from '@nextui-org/react';
import { remark } from 'remark';
import html from 'remark-html';
import { Worklogs } from '@/app/worklogs/_actions/getWorklogs';
import classNames from 'classnames';

export const IssuesTableCell = ({ data, isWeekend }: Readonly<{ data: Worklogs[number]; isWeekend: boolean }>) => {
	const buttonClassnames = classNames('shrink-0', { 'opacity-disabled data-[hover=true]:opacity-45': isWeekend });

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
							className={buttonClassnames}
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
